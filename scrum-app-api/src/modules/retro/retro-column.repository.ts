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
    // Se está atualizando order_index, precisamos usar transação para evitar conflitos
    if (updateDto.orderIndex !== undefined) {
      await this.repository.manager.transaction(async transactionalEntityManager => {
        // Primeiro buscar a coluna atual
        const currentColumn = await transactionalEntityManager.findOne(RetroColumn, { where: { id } });
        if (!currentColumn) {
          return;
        }

        // Se o orderIndex mudou, usar um valor temporário primeiro
        if (currentColumn.order_index !== updateDto.orderIndex) {
          // Usar um valor temporário negativo único
          const tempIndex = -(Date.now() % 1000000);
          
          await transactionalEntityManager.update(
            RetroColumn,
            { id },
            { order_index: tempIndex }
          );
          
          // Depois atualizar para o valor final
          await transactionalEntityManager.update(
            RetroColumn,
            { id },
            { 
              ...updateDto,
              order_index: updateDto.orderIndex 
            }
          );
        } else {
          // Se orderIndex não mudou, update normal
          await transactionalEntityManager.update(RetroColumn, { id }, updateDto);
        }
      });
    } else {
      // Update normal se não há orderIndex
      await this.repository.update(id, updateDto);
    }
    
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    // Buscar a coluna que será deletada para saber o board_id e order_index
    const columnToDelete = await this.repository.findOne({ where: { id } });
    if (!columnToDelete) {
      return; // Coluna não existe
    }

    await this.repository.manager.transaction(async transactionalEntityManager => {
      // Deletar a coluna
      await transactionalEntityManager.delete(RetroColumn, { id });

      // Reorganizar os índices das colunas restantes
      const remainingColumns = await transactionalEntityManager.find(RetroColumn, {
        where: { board_id: columnToDelete.board_id },
        order: { order_index: 'ASC' }
      });

      // Atualizar os índices para serem sequenciais (0, 1, 2, ...)
      for (let i = 0; i < remainingColumns.length; i++) {
        if (remainingColumns[i].order_index !== i) {
          await transactionalEntityManager.update(
            RetroColumn,
            { id: remainingColumns[i].id },
            { order_index: i }
          );
        }
      }
    });
  }

  async reorderColumns(boardId: string, columnIds: string[]): Promise<void> {
    // Usar uma transação para garantir consistência
    await this.repository.manager.transaction(async transactionalEntityManager => {
      // Primeiro, atualizar todas as colunas para índices temporários negativos
      // para evitar conflitos de constraint único
      for (let i = 0; i < columnIds.length; i++) {
        await transactionalEntityManager.update(
          RetroColumn,
          { id: columnIds[i], board_id: boardId },
          { order_index: -(i + 1) } // Usar valores negativos temporários
        );
      }

      // Depois, atualizar para os índices finais corretos
      for (let i = 0; i < columnIds.length; i++) {
        await transactionalEntityManager.update(
          RetroColumn,
          { id: columnIds[i], board_id: boardId },
          { order_index: i }
        );
      }
    });
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
