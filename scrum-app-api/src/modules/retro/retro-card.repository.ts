import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RetroCard } from '../../shared/database/entities/retro-card.entity';
import { RetroCardVote } from '../../shared/database/entities/retro-card-vote.entity';
import { CreateRetroCardDto } from './dto/create-retro-card.dto';
import { UpdateRetroCardDto } from './dto/update-retro-card.dto';

@Injectable()
export class RetroCardRepository {
  constructor(
    @InjectRepository(RetroCard)
    private readonly cardRepository: Repository<RetroCard>,
    @InjectRepository(RetroCardVote)
    private readonly voteRepository: Repository<RetroCardVote>,
  ) {}

  async create(columnId: string, createDto: CreateRetroCardDto, authorId?: string): Promise<RetroCard> {
    const card = this.cardRepository.create({
      ...createDto,
      column_id: columnId,
      author_id: createDto.isAnonymous ? null : authorId,
    });
    return this.cardRepository.save(card);
  }

  async findByColumnId(columnId: string): Promise<RetroCard[]> {
    return this.cardRepository.find({
      where: { column_id: columnId },
      relations: ['author', 'votes', 'votes.user'],
      order: { created_at: 'ASC' },
    });
  }

  async findById(id: string): Promise<RetroCard | null> {
    return this.cardRepository.findOne({
      where: { id },
      relations: ['column', 'author', 'votes', 'votes.user'],
    });
  }

  async update(id: string, updateDto: UpdateRetroCardDto): Promise<RetroCard | null> {
    await this.cardRepository.update(id, updateDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.cardRepository.delete(id);
  }

  async addVote(cardId: string, userId: string): Promise<RetroCardVote> {
    // Verifica se o usuário já votou neste card
    const existingVote = await this.voteRepository.findOne({
      where: { card_id: cardId, user_id: userId }
    });

    if (existingVote) {
      throw new Error('User has already voted on this card');
    }

    const vote = this.voteRepository.create({
      card_id: cardId,
      user_id: userId,
    });

    return this.voteRepository.save(vote);
  }

  async removeVote(cardId: string, userId: string): Promise<void> {
    await this.voteRepository.delete({
      card_id: cardId,
      user_id: userId,
    });
  }

  async getUserVotesCount(userId: string, boardId: string): Promise<number> {
    const result = await this.voteRepository
      .createQueryBuilder('vote')
      .innerJoin('vote.card', 'card')
      .innerJoin('card.column', 'column')
      .where('vote.user_id = :userId', { userId })
      .andWhere('column.board_id = :boardId', { boardId })
      .getCount();

    return result;
  }

  async hasUserVoted(cardId: string, userId: string): Promise<boolean> {
    const vote = await this.voteRepository.findOne({
      where: { card_id: cardId, user_id: userId }
    });
    return !!vote;
  }

  async getCardsByBoardId(boardId: string): Promise<RetroCard[]> {
    return this.cardRepository
      .createQueryBuilder('card')
      .innerJoin('card.column', 'column')
      .leftJoinAndSelect('card.author', 'author')
      .leftJoinAndSelect('card.votes', 'votes')
      .leftJoinAndSelect('votes.user', 'voteUser')
      .where('column.board_id = :boardId', { boardId })
      .orderBy('card.votes_count', 'DESC')
      .addOrderBy('card.created_at', 'ASC')
      .getMany();
  }
}
