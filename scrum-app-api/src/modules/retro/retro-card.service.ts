import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { RetroCardRepository } from './retro-card.repository';
import { RetroColumnRepository } from './retro-column.repository';
import { RetroBoardRepository } from './retro-board.repository';
import { CreateRetroCardDto } from './dto/create-retro-card.dto';
import { UpdateRetroCardDto } from './dto/update-retro-card.dto';
import { RetroCard } from '../../shared/database/entities/retro-card.entity';
import { RetroCardVote } from '../../shared/database/entities/retro-card-vote.entity';

@Injectable()
export class RetroCardService {
  constructor(
    private readonly cardRepository: RetroCardRepository,
    private readonly columnRepository: RetroColumnRepository,
    private readonly boardRepository: RetroBoardRepository,
  ) {}

  async create(columnId: string, createDto: CreateRetroCardDto, userId?: string): Promise<RetroCard> {
    // Verificar se a coluna existe
    const column = await this.columnRepository.findById(columnId);
    if (!column) {
      throw new NotFoundException('Retro column not found');
    }

    // Verificar se o board permite cards anônimos (caso seja anônimo)
    const board = await this.boardRepository.findById(column.board_id);
    if (!board) {
      throw new NotFoundException('Retro board not found');
    }

    if (createDto.isAnonymous && !board.allow_anonymous) {
      throw new BadRequestException('Anonymous cards are not allowed in this board');
    }

    return this.cardRepository.create(columnId, createDto, userId);
  }

  async findByColumnId(columnId: string): Promise<RetroCard[]> {
    // Verificar se a coluna existe
    const column = await this.columnRepository.findById(columnId);
    if (!column) {
      throw new NotFoundException('Retro column not found');
    }

    return this.cardRepository.findByColumnId(columnId);
  }

  async findById(id: string): Promise<RetroCard> {
    const card = await this.cardRepository.findById(id);
    if (!card) {
      throw new NotFoundException('Retro card not found');
    }
    return card;
  }

  async update(id: string, updateDto: UpdateRetroCardDto, userId: string): Promise<RetroCard> {
    const card = await this.findById(id);
    
    // Verificar se o usuário tem permissão para editar (autor do card ou dono do board)
    const column = await this.columnRepository.findById(card.column_id);
    const board = await this.boardRepository.findById(column!.board_id);
    
    if (card.author_id !== userId && board!.created_by !== userId) {
      throw new ForbiddenException('You can only edit your own cards or cards in your own boards');
    }

    const updatedCard = await this.cardRepository.update(id, updateDto);
    if (!updatedCard) {
      throw new NotFoundException('Retro card not found');
    }
    
    return updatedCard;
  }

  async delete(id: string, userId: string): Promise<void> {
    const card = await this.findById(id);
    
    // Verificar se o usuário tem permissão para deletar (autor do card ou dono do board)
    const column = await this.columnRepository.findById(card.column_id);
    const board = await this.boardRepository.findById(column!.board_id);
    
    if (card.author_id !== userId && board!.created_by !== userId) {
      throw new ForbiddenException('You can only delete your own cards or cards in your own boards');
    }

    await this.cardRepository.delete(id);
  }

  async addVote(cardId: string, userId: string): Promise<RetroCardVote> {
    const card = await this.findById(cardId);
    
    // Verificar se o board permite votação
    const column = await this.columnRepository.findById(card.column_id);
    const board = await this.boardRepository.findById(column!.board_id);
    
    if (!board!.allow_voting) {
      throw new BadRequestException('Voting is not allowed in this board');
    }

    // Verificar se o usuário já atingiu o limite de votos
    const userVotesCount = await this.cardRepository.getUserVotesCount(userId, board!.id);
    if (userVotesCount >= board!.max_votes_per_user) {
      throw new BadRequestException(`You have reached the maximum number of votes (${board!.max_votes_per_user})`);
    }

    try {
      return await this.cardRepository.addVote(cardId, userId);
    } catch (error) {
      if (error instanceof Error && error.message.includes('already voted')) {
        throw new BadRequestException('You have already voted on this card');
      }
      throw error;
    }
  }

  async removeVote(cardId: string, userId: string): Promise<void> {
    // Verificar se o card existe
    await this.findById(cardId);
    
    // Verificar se o usuário votou neste card
    const hasVoted = await this.cardRepository.hasUserVoted(cardId, userId);
    if (!hasVoted) {
      throw new BadRequestException('You have not voted on this card');
    }

    await this.cardRepository.removeVote(cardId, userId);
  }

  async getCardsByBoardId(boardId: string): Promise<RetroCard[]> {
    // Verificar se o board existe
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundException('Retro board not found');
    }

    return this.cardRepository.getCardsByBoardId(boardId);
  }
}
