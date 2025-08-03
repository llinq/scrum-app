import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { RetroColumnRepository } from './retro-column.repository';
import { RetroBoardRepository } from './retro-board.repository';
import { CreateRetroColumnDto } from './dto/create-retro-column.dto';
import { UpdateRetroColumnDto } from './dto/update-retro-column.dto';
import { RetroWebSocketGateway } from './retro-websocket.gateway';
import { RetroColumnResponseDto } from './dto/retro-column-response.dto';

@Injectable()
export class RetroColumnService {
  constructor(
    private readonly columnRepository: RetroColumnRepository,
    private readonly boardRepository: RetroBoardRepository,
    private readonly retroWebSocketGateway: RetroWebSocketGateway,
  ) {}

  async create(boardId: string, createDto: CreateRetroColumnDto, userId: string): Promise<RetroColumnResponseDto> {
    // Verificar se o board existe e se o usuário tem permissão
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundException('Retro board not found');
    }
    
    if (board.created_by !== userId) {
      throw new ForbiddenException('You can only add columns to your own retro boards');
    }

    const newColumn = await this.columnRepository.create(boardId, createDto);

    const newColumnDto = RetroColumnResponseDto.fromEntity(newColumn);
    
    // Emitir evento WebSocket
    this.retroWebSocketGateway.emitColumnCreated(boardId, newColumnDto);

    return newColumnDto;
  }

  async findByBoardId(boardId: string): Promise<RetroColumnResponseDto[]> {
    // Verificar se o board existe
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundException('Retro board not found');
    }

    const columns = await this.columnRepository.findByBoardId(boardId);
    return RetroColumnResponseDto.fromEntities(columns);
  }

  async findById(id: string): Promise<RetroColumnResponseDto> {
    const column = await this.columnRepository.findById(id);
    if (!column) {
      throw new NotFoundException('Retro column not found');
    }
    return RetroColumnResponseDto.fromEntity(column);
  }

  async update(id: string, updateDto: UpdateRetroColumnDto, userId: string): Promise<RetroColumnResponseDto> {
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

    const updatedColumnDto = RetroColumnResponseDto.fromEntity(updatedColumn);

    // Emitir evento WebSocket
    this.retroWebSocketGateway.emitColumnUpdated(updatedColumn.board_id, updatedColumnDto);

    return updatedColumnDto;
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

  async reorderColumns(boardId: string, columnIds: string[], userId: string): Promise<RetroColumnResponseDto[]> {
    // Verificar se o board existe e se o usuário tem permissão
    const board = await this.boardRepository.findById(boardId);
    if (!board) {
      throw new NotFoundException('Retro board not found');
    }
    
    if (board.created_by !== userId) {
      throw new ForbiddenException('You can only reorder columns of your own retro boards');
    }

    await this.columnRepository.reorderColumns(boardId, columnIds);
    const reorderedColumnsDto = await this.findByBoardId(boardId);
    
    // Emitir evento WebSocket
    this.retroWebSocketGateway.emitColumnsReordered(boardId, reorderedColumnsDto);
    
    return reorderedColumnsDto;
  }
}
