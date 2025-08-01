import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { RetroBoardRepository } from './retro-board.repository';
import { RetroColumnRepository } from './retro-column.repository';
import { CreateRetroBoardDto } from './dto/create-retro-board.dto';
import { UpdateRetroBoardDto } from './dto/update-retro-board.dto';
import { RetroBoard } from '../../shared/database/entities/retro-board.entity';

@Injectable()
export class RetroBoardService {
  constructor(
    private readonly boardRepository: RetroBoardRepository,
    private readonly columnRepository: RetroColumnRepository,
  ) {}

  async create(createDto: CreateRetroBoardDto, createdBy: string): Promise<RetroBoard> {
    // Criar o board
    const board = await this.boardRepository.create(createDto, createdBy);
    
    // Criar as colunas padrão
    await this.columnRepository.createDefaultColumns(board.id);
    
    // Retornar o board com as colunas
    return this.findById(board.id);
  }

  async findAll(): Promise<RetroBoard[]> {
    return this.boardRepository.findAll({
      where: { is_active: true }
    });
  }

  async findById(id: string): Promise<RetroBoard> {
    const board = await this.boardRepository.findById(id);
    if (!board) {
      throw new NotFoundException('Retro board not found');
    }
    return board;
  }

  async findByCreator(createdBy: string): Promise<RetroBoard[]> {
    return this.boardRepository.findByCreator(createdBy);
  }

  async update(id: string, updateDto: UpdateRetroBoardDto, userId: string): Promise<RetroBoard> {
    const board = await this.findById(id);
    
    // Verificar se o usuário tem permissão para editar
    if (board.created_by !== userId) {
      throw new ForbiddenException('You can only edit your own retro boards');
    }

    const updatedBoard = await this.boardRepository.update(id, updateDto);
    if (!updatedBoard) {
      throw new NotFoundException('Retro board not found');
    }
    
    return updatedBoard;
  }

  async delete(id: string, userId: string): Promise<void> {
    const board = await this.findById(id);
    
    // Verificar se o usuário tem permissão para deletar
    if (board.created_by !== userId) {
      throw new ForbiddenException('You can only delete your own retro boards');
    }

    await this.boardRepository.delete(id);
  }

  async archive(id: string, userId: string): Promise<RetroBoard> {
    const board = await this.findById(id);
    
    // Verificar se o usuário tem permissão para arquivar
    if (board.created_by !== userId) {
      throw new ForbiddenException('You can only archive your own retro boards');
    }

    const archivedBoard = await this.boardRepository.archive(id);
    if (!archivedBoard) {
      throw new NotFoundException('Retro board not found');
    }
    
    return archivedBoard;
  }
}
