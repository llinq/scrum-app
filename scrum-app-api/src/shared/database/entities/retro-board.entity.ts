import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('retro_boards')
export class RetroBoard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'uuid' })
  created_by: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  // Configurações do board
  @Column({ type: 'boolean', default: true })
  allow_voting: boolean;

  @Column({ type: 'integer', default: 5 })
  max_votes_per_user: number;

  @Column({ type: 'boolean', default: true })
  show_author: boolean;

  @Column({ type: 'boolean', default: false })
  allow_anonymous: boolean;

  @Column({ type: 'boolean', default: false })
  blur_mode: boolean;

  // Metadados
  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamp with time zone', nullable: true })
  archived_at: Date | null;

  // Relacionamentos
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany('RetroColumn', 'board')
  columns: any[];
}
