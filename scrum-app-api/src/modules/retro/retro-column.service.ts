import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { RetroColumnRepository } from './retro-column.repository';
import { RetroBoardRepository } from './retro-board.repository';
import { CreateRetroColumnDto } from './dto/create-retro-column.dto';
import { UpdateRetroColumnDto } from './dto/update-retro-column.dto';
import { RetroColumn } from '../../shared/database/entities/retro-column.entity';
import { RetroWebSocketGateway } from './retro-websocket.gateway';

@Injectable()
export class RetroColumnService {
  constructor(
    private readonly columnRepository: RetroColumnRepository,
    private readonly boardRepository: RetroBoardRepository,
    private readonly retroWebSocketGateway: RetroWebSocketGateway,
  ) {}

  async create(boardId: string, createDto: CreateRetroColumnDto, userId: string): Promise<RetroColumn> {
    // Verificar se o board existe e se o usuário tem permissão
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundException('Retro board not found');
    }
    
    if (board.created_by !== userId) {
      throw new ForbiddenException('You can only add columns to your own retro boards');
    }

    const newColumn = await this.columnRepository.create(boardId, createDto);
    
    // Emitir evento WebSocket
    this.retroWebSocketGateway.emitColumnCreated(boardId, newColumn);
    
    return newColumn;
  }

  async findByBoardId(boardId: string): Promise<RetroColumn[]> {
    // Verificar se o board existe
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundException('Retro board not found');
    }

    return this.columnRepository.findByBoardId(boardId);
  }

  async findById(id: string): Promise<RetroColumn> {
    const column = await this.columnRepository.findById(id);
    if (!column) {
      throw new NotFoundException('Retro column not found');
    }
    return column;
  }

  async update(id: string, updateDto: UpdateRetroColumnDto, userId: string): Promise<RetroColumn> {
    const column = await this.findById(id);
    
    // Verificar se o usuário tem permissão para editar
    const board = await this.boardRepository.findById(column.board_id);
    if (!board || board.created_by !== userId) {
      throw new ForbiddenException('You can only edit columns of your own retro boards');
    }

    const updatedColumn = await this.columnRepository.update(id, updateDto);
    if (!updatedColumn) {
      throw new NotFoundException('Retro column not found');
    }
    
    // Emitir evento WebSocket
    this.retroWebSocketGateway.emitColumnUpdated(updatedColumn.board_id, updatedColumn);
    
    return updatedColumn;
  }

  async delete(id: string, userId: string): Promise<void> {
    const column = await this.findById(id);
    
    // Verificar se o usuário tem permissão para deletar
    const board = await this.boardRepository.findById(column.board_id);
    if (!board || board.created_by !== userId) {
      throw new ForbiddenException('You can only delete columns of your own retro boards');
    }

    await this.columnRepository.delete(id);
    
    // Emitir evento WebSocket
    this.retroWebSocketGateway.emitColumnDeleted(column.board_id, id);
  }

  async reorderColumns(boardId: string, columnIds: string[], userId: string): Promise<RetroColumn[]> {
    // Verificar se o board existe e se o usuário tem permissão
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundException('Retro board not found');
    }
    
    if (board.created_by !== userId) {
      throw new ForbiddenException('You can only reorder columns of your own retro boards');
    }

    await this.columnRepository.reorderColumns(boardId, columnIds);
    const reorderedColumns = await this.findByBoardId(boardId);
    
    // Emitir evento WebSocket
    this.retroWebSocketGateway.emitColumnsReordered(boardId, reorderedColumns);
    
    return reorderedColumns;
  }
}
