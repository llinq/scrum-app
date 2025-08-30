import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions } from "typeorm";
import { RetroBoard } from "../../shared/database/entities/retro-board.entity";
import { CreateRetroBoardDto, UpdateRetroBoardDto } from "./dto";
import { RetroWebSocketGateway } from "./retro-websocket.gateway";

@Injectable()
export class RetroBoardRepository {
  constructor(
    @InjectRepository(RetroBoard)
    private readonly repository: Repository<RetroBoard>,
    private readonly retroWebSocketGateway: RetroWebSocketGateway
  ) {}

  async create(
    createDto: CreateRetroBoardDto,
    createdBy: string
  ): Promise<RetroBoard> {
    const board = this.repository.create({
      ...createDto,
      created_by: createdBy,
    });
    return this.repository.save(board);
  }

  async findAll(options?: FindManyOptions<RetroBoard>): Promise<RetroBoard[]> {
    return this.repository.find({
      ...options,
      relations: ["creator", "columns", "columns.cards"],
      order: { created_at: "DESC" },
    });
  }

  async findById(id: string): Promise<RetroBoard | null> {
    return this.repository.findOne({
      where: { id },
      relations: [
        "creator",
        "columns",
        "columns.cards",
        "columns.cards.author",
        "columns.cards.votes",
      ],
    });
  }

  async findByCreator(createdBy: string): Promise<RetroBoard[]> {
    return this.repository.find({
      where: { created_by: createdBy, is_active: true },
      relations: ["creator", "columns"],
      order: { created_at: "DESC" },
    });
  }

  async update(
    id: string,
    updateDto: UpdateRetroBoardDto
  ): Promise<RetroBoard | null> {
    const updateData: Partial<RetroBoard> = {};

    if (updateDto.title !== undefined) {
      updateData.title = updateDto.title;
    }

    if (updateDto.allow_anonymous !== undefined) {
      updateData.allow_anonymous = updateDto.allow_anonymous;
    }

    if (updateDto.allow_voting !== undefined) {
      updateData.allow_voting = updateDto.allow_voting;
    }

    if (updateDto.max_votes_per_user !== undefined) {
      updateData.max_votes_per_user = updateDto.max_votes_per_user;
    }

    if (updateDto.show_author !== undefined) {
      updateData.show_author = updateDto.show_author;
    }

    if (updateDto.blur_mode !== undefined) {
      updateData.blur_mode = updateDto.blur_mode;
    }

    if (updateDto.is_active !== undefined) {
      updateData.is_active = updateDto.is_active;
    }

    await this.repository.update(id, updateData);

    const updatedBoard = await this.findById(id);
    if (!updatedBoard) {
      throw new NotFoundException("Retro board not found");
    }

    this.retroWebSocketGateway.emitBoardUpdated(updatedBoard.id, updatedBoard);

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

  async toggleBlurMode(id: string): Promise<RetroBoard | null> {
    const board = await this.findById(id);
    if (!board) {
      throw new NotFoundException("Retro board not found");
    }

    await this.repository.update(id, {
      blur_mode: !board.blur_mode,
    });

    const updatedBoard = await this.findById(id);
    if (updatedBoard) {
      this.retroWebSocketGateway.emitBoardUpdated(updatedBoard.id, updatedBoard);
    }

    return updatedBoard;
  }
}
