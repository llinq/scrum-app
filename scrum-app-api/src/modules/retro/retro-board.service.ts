import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { RetroBoardRepository } from "./retro-board.repository";
import { RetroColumnRepository } from "./retro-column.repository";
import { RetroWebSocketGateway } from "./retro-websocket.gateway";
import { CreateRetroBoardDto, UpdateRetroBoardDto, RetroBoardResponseDto } from "./dto";

@Injectable()
export class RetroBoardService {
  constructor(
    private readonly boardRepository: RetroBoardRepository,
    private readonly columnRepository: RetroColumnRepository,
    private readonly retroWebSocketGateway: RetroWebSocketGateway
  ) {}

  async create(
    createDto: CreateRetroBoardDto,
    createdBy: string
  ): Promise<RetroBoardResponseDto> {
    // Criar o board
    const board = await this.boardRepository.create(createDto, createdBy);

    // Criar as colunas padrão
    await this.columnRepository.createDefaultColumns(board.id);

    return RetroBoardResponseDto.fromEntity(board);
  }

  async findAll(): Promise<RetroBoardResponseDto[]> {
    const boards = await this.boardRepository.findAll();
    return RetroBoardResponseDto.fromEntities(boards);
  }

  async findById(id: string): Promise<RetroBoardResponseDto> {
    const board = await this.boardRepository.findById(id);
    if (!board) {
      throw new NotFoundException("Retro board not found");
    }
    return RetroBoardResponseDto.fromEntity(board);
  }

  async findByCreator(createdBy: string): Promise<RetroBoardResponseDto[]> {
    const boards = await this.boardRepository.findByCreator(createdBy);
    return RetroBoardResponseDto.fromEntities(boards);
  }

  async update(
    id: string,
    updateDto: UpdateRetroBoardDto,
    userId: string
  ): Promise<RetroBoardResponseDto> {
    const board = await this.findById(id);

    // Verificar se o usuário tem permissão para editar
    if (board.created_by !== userId) {
      throw new ForbiddenException("You can only edit your own retro boards");
    }

    const updatedBoard = await this.boardRepository.update(id, updateDto);
    if (!updatedBoard) {
      throw new NotFoundException("Retro board not found");
    }

    const updatedBoardDto = RetroBoardResponseDto.fromEntity(updatedBoard);

    return updatedBoardDto;
  }

  async delete(id: string, userId: string): Promise<void> {
    const board = await this.findById(id);

    // Verificar se o usuário tem permissão para deletar
    if (board.created_by !== userId) {
      throw new ForbiddenException("You can only delete your own retro boards");
    }

    this.retroWebSocketGateway.emitBoardDeleted(id);
    await this.boardRepository.delete(id);
  }

  async archive(id: string, userId: string): Promise<RetroBoardResponseDto> {
    const board = await this.findById(id);

    // Verificar se o usuário tem permissão para arquivar
    if (board.created_by !== userId) {
      throw new ForbiddenException(
        "You can only archive your own retro boards"
      );
    }

    const archivedBoard = await this.boardRepository.archive(id);
    if (!archivedBoard) {
      throw new NotFoundException("Retro board not found");
    }

    const archivedBoardDto = RetroBoardResponseDto.fromEntity(archivedBoard);

    return archivedBoardDto;
  }
}
