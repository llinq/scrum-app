import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity('retro_card_votes')
@Unique(['card_id', 'user_id'])
export class RetroCardVote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  card_id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  // Relacionamentos
  @ManyToOne('RetroCard', 'votes', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'card_id' })
  card: any;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
