import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { RetroCardRepository } from "./retro-card.repository";
import { RetroColumnRepository } from "./retro-column.repository";
import { RetroBoardRepository } from "./retro-board.repository";
import { CreateRetroCardDto } from "./dto/create-retro-card.dto";
import { UpdateRetroCardDto } from "./dto/update-retro-card.dto";
import { RetroCard } from "../../shared/database/entities/retro-card.entity";
import { RetroCardVote } from "../../shared/database/entities/retro-card-vote.entity";
import { RetroWebSocketGateway } from "./retro-websocket.gateway";
import { RetroCardResponseDto } from "./dto/retro-card-response.dto";

@Injectable()
export class RetroCardService {
  constructor(
    private readonly cardRepository: RetroCardRepository,
    private readonly columnRepository: RetroColumnRepository,
    private readonly boardRepository: RetroBoardRepository,
    private readonly retroWebSocketGateway: RetroWebSocketGateway
  ) {}

  async create(
    columnId: string,
    createDto: CreateRetroCardDto,
    userId?: string
  ): Promise<RetroCardResponseDto> {
    // Verificar se a coluna existe
    const column = await this.columnRepository.findById(columnId);
    if (!column) {
      throw new NotFoundException("Retro column not found");
    }

    // Verificar se o board permite cards anônimos (caso seja anônimo)
    const board = await this.boardRepository.findById(column.board_id);
    if (!board) {
      throw new NotFoundException("Retro board not found");
    }

    if (createDto.isAnonymous && !board.allow_anonymous) {
      throw new BadRequestException(
        "Anonymous cards are not allowed in this board"
      );
    }

    const newCard = await this.cardRepository.create(
      columnId,
      createDto,
      userId
    );

    const newCardDto = RetroCardResponseDto.fromEntity(newCard, {
      includeAuthor: board.show_author,
    });

    // Emitir evento WebSocket
    this.retroWebSocketGateway.emitCardCreated(board.id, newCardDto);

    return newCardDto;
  }

  async findByColumnId(columnId: string): Promise<RetroCardResponseDto[]> {
    // Verificar se a coluna existe
    const column = await this.columnRepository.findById(columnId);
    if (!column) {
      throw new NotFoundException("Retro column not found");
    }

    const cardsByColumnId = await this.cardRepository.findByColumnId(columnId);

    return RetroCardResponseDto.fromEntities(cardsByColumnId, {
      includeAuthor: column.board.show_author,
    });
  }

  async findById(id: string): Promise<RetroCardResponseDto> {
    const card = await this.cardRepository.findById(id);
    if (!card) {
      throw new NotFoundException("Retro card not found");
    }
    return RetroCardResponseDto.fromEntity(card, {
      includeAuthor: card.column.board.show_author,
    });
  }

  async update(
    id: string,
    updateDto: UpdateRetroCardDto,
    userId: string
  ): Promise<RetroCardResponseDto> {
    const card = await this.findById(id);

    // Verificar se o usuário tem permissão para editar (autor do card ou dono do board)
    const column = await this.columnRepository.findById(card.column_id);
    const board = await this.boardRepository.findById(column!.board_id);

    if (!board) {
      throw new NotFoundException("Retro board not found");
    }

    if (card.author_id !== userId && board.created_by !== userId) {
      throw new ForbiddenException(
        "You can only edit your own cards or cards in your own boards"
      );
    }

    const updatedCard = await this.cardRepository.update(id, updateDto);
    if (!updatedCard) {
      throw new NotFoundException("Retro card not found");
    }

    const updatedCardDto = RetroCardResponseDto.fromEntity(updatedCard, {
      includeAuthor: board.show_author,
    });

    // Emitir evento WebSocket
    this.retroWebSocketGateway.emitCardUpdated(
      column!.board_id,
      updatedCardDto
    );

    return updatedCardDto;
  }

  async delete(id: string, userId: string): Promise<void> {
    const card = await this.findById(id);

    // Verificar se o usuário tem permissão para deletar (autor do card ou dono do board)
    const column = await this.columnRepository.findById(card.column_id);
    const board = await this.boardRepository.findById(column!.board_id);

    if (card.author_id !== userId && board!.created_by !== userId) {
      throw new ForbiddenException(
        "You can only delete your own cards or cards in your own boards"
      );
    }

    await this.cardRepository.delete(id);

    // Emitir evento WebSocket
    this.retroWebSocketGateway.emitCardDeleted(column!.board_id, id);
  }

  async addVote(cardId: string, userId: string): Promise<RetroCardVote> {
    const card = await this.findById(cardId);

    // Verificar se o board permite votação
    const column = await this.columnRepository.findById(card.column_id);
    const board = await this.boardRepository.findById(column!.board_id);

    if (!board!.allow_voting) {
      throw new BadRequestException("Voting is not allowed in this board");
    }

    // Verificar se o usuário já atingiu o limite de votos
    const userVotesCount = await this.cardRepository.getUserVotesCount(
      userId,
      board!.id
    );
    if (userVotesCount >= board!.max_votes_per_user) {
      throw new BadRequestException(
        `You have reached the maximum number of votes (${
          board!.max_votes_per_user
        })`
      );
    }

    try {
      const vote = await this.cardRepository.addVote(cardId, userId);

      // Buscar card atualizado para obter vote count
      const updatedCard = await this.findById(cardId);

      // Emitir evento WebSocket
      this.retroWebSocketGateway.emitCardVoted(
        board!.id,
        cardId,
        updatedCard.votes_count || 0
      );

      return vote;
    } catch (error) {
      if (error instanceof Error && error.message.includes("already voted")) {
        throw new BadRequestException("You have already voted on this card");
      }
      throw error;
    }
  }

  async removeVote(cardId: string, userId: string): Promise<void> {
    // Verificar se o card existe
    const card = await this.findById(cardId);

    // Verificar se o usuário votou neste card
    const hasVoted = await this.cardRepository.hasUserVoted(cardId, userId);
    if (!hasVoted) {
      throw new BadRequestException("You have not voted on this card");
    }

    await this.cardRepository.removeVote(cardId, userId);

    // Buscar card atualizado para obter vote count
    const updatedCard = await this.findById(cardId);
    const column = await this.columnRepository.findById(card.column_id);

    // Emitir evento WebSocket
    this.retroWebSocketGateway.emitCardVoted(
      column!.board_id,
      cardId,
      updatedCard.votes_count || 0
    );
  }

  async getCardsByBoardId(boardId: string): Promise<RetroCard[]> {
    // Verificar se o board existe
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundException("Retro board not found");
    }

    return this.cardRepository.getCardsByBoardId(boardId);
  }
}
