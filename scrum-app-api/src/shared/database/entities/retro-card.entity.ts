import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { RetroColumn } from './retro-column.entity';
import { User } from './user.entity';

@Entity('retro_cards')
export class RetroCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  column_id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'uuid', nullable: true })
  author_id: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  author_name: string | null;

  @Column({ type: 'boolean', default: false })
  is_anonymous: boolean;

  @Column({ type: 'integer', default: 0 })
  votes_count: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => RetroColumn, 'cards', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'column_id' })
  column: RetroColumn;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author: User | null;

  @OneToMany('RetroCardVote', 'card')
  votes: any[];
}
