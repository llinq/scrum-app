import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { RetroBoard } from '../../shared/database/entities/retro-board.entity';
import { CreateRetroBoardDto } from './dto/create-retro-board.dto';
import { UpdateRetroBoardDto } from './dto/update-retro-board.dto';

@Injectable()
export class RetroBoardRepository {
  constructor(
    @InjectRepository(RetroBoard)
    private readonly repository: Repository<RetroBoard>,
  ) {}

  async create(createDto: CreateRetroBoardDto, createdBy: string): Promise<RetroBoard> {
    const board = this.repository.create({
      ...createDto,
      created_by: createdBy,
    });
    return this.repository.save(board);
  }

  async findAll(options?: FindManyOptions<RetroBoard>): Promise<RetroBoard[]> {
    return this.repository.find({
      ...options,
      relations: ['creator', 'columns', 'columns.cards'],
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: string): Promise<RetroBoard | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['creator', 'columns', 'columns.cards', 'columns.cards.author', 'columns.cards.votes'],
    });
  }

  async findByCreator(createdBy: string): Promise<RetroBoard[]> {
    return this.repository.find({
      where: { created_by: createdBy, is_active: true },
      relations: ['creator', 'columns'],
      order: { created_at: 'DESC' },
    });
  }

  async update(id: string, updateDto: UpdateRetroBoardDto): Promise<RetroBoard | null> {
    await this.repository.update(id, updateDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async archive(id: string): Promise<RetroBoard | null> {
    await this.repository.update(id, {
      is_active: false,
      archived_at: new Date(),
    });
    return this.findById(id);
  }
}
