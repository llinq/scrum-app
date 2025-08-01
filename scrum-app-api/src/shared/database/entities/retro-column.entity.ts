import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Unique } from 'typeorm';
import { RetroBoard } from './retro-board.entity';

@Entity('retro_columns')
@Unique(['board_id', 'order_index'])
export class RetroColumn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  board_id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'integer', default: 0 })
  order_index: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => RetroBoard, 'columns', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_id' })
  board: RetroBoard;

  @OneToMany('RetroCard', 'column')
  cards: any[];
}
