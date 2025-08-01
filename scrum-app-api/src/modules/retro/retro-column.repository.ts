import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RetroColumn } from '../../shared/database/entities/retro-column.entity';
import { CreateRetroColumnDto } from './dto/create-retro-column.dto';
import { UpdateRetroColumnDto } from './dto/update-retro-column.dto';

@Injectable()
export class RetroColumnRepository {
  constructor(
    @InjectRepository(RetroColumn)
    private readonly repository: Repository<RetroColumn>,
  ) {}

  async create(boardId: string, createDto: CreateRetroColumnDto): Promise<RetroColumn> {
    // Se orderIndex não foi fornecido, pega o próximo índice disponível
    let orderIndex = createDto.orderIndex;
    if (orderIndex === undefined) {
      const result = await this.repository
        .createQueryBuilder('column')
        .select('MAX(column.order_index)', 'max')
        .where('column.board_id = :boardId', { boardId })
        .getRawOne();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const maxOrder = Number(result?.max) || -1;
      orderIndex = maxOrder + 1;
    }

    const column = this.repository.create({
      ...createDto,
      board_id: boardId,
      order_index: orderIndex,
    });
    return this.repository.save(column);
  }

  async findByBoardId(boardId: string): Promise<RetroColumn[]> {
    return this.repository.find({
      where: { board_id: boardId },
      relations: ['cards', 'cards.author', 'cards.votes'],
      order: { order_index: 'ASC' },
    });
  }

  async findById(id: string): Promise<RetroColumn | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['board', 'cards', 'cards.author', 'cards.votes'],
    });
  }

  async update(id: string, updateDto: UpdateRetroColumnDto): Promise<RetroColumn | null> {
    await this.repository.update(id, updateDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async reorderColumns(boardId: string, columnIds: string[]): Promise<void> {
    // Atualiza a ordem das colunas
    for (let i = 0; i < columnIds.length; i++) {
      await this.repository.update(
        { id: columnIds[i], board_id: boardId },
        { order_index: i }
      );
    }
  }

  async createDefaultColumns(boardId: string): Promise<RetroColumn[]> {
    const defaultColumns = [
      { title: 'O que foi bem?', orderIndex: 0 },
      { title: 'O que pode melhorar?', orderIndex: 1 },
      { title: 'Ações para próxima sprint', orderIndex: 2 },
    ];

    const columns: RetroColumn[] = [];
    for (const columnData of defaultColumns) {
      const column = await this.create(boardId, columnData);
      columns.push(column);
    }

    return columns;
  }
}
