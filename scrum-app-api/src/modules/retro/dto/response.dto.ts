import { ApiProperty } from '@nestjs/swagger';

export class RetroBoardResponseDto {
  @ApiProperty({ example: 'uuid-board-id' })
  id: string;

  @ApiProperty({ example: 'Sprint 15 Retrospectiva' })
  title: string;

  @ApiProperty({ example: 'uuid-user-id' })
  created_by: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  updated_at: Date;

  @ApiProperty({ example: true })
  allow_voting: boolean;

  @ApiProperty({ example: 5 })
  max_votes_per_user: number;

  @ApiProperty({ example: true })
  show_author: boolean;

  @ApiProperty({ example: false })
  allow_anonymous: boolean;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty({ example: null, nullable: true })
  archived_at: Date | null;
}

export class RetroColumnResponseDto {
  @ApiProperty({ example: 'uuid-column-id' })
  id: string;

  @ApiProperty({ example: 'uuid-board-id' })
  board_id: string;

  @ApiProperty({ example: 'O que foi bem?' })
  title: string;

  @ApiProperty({ example: 0 })
  order_index: number;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  updated_at: Date;
}

export class RetroCardResponseDto {
  @ApiProperty({ example: 'uuid-card-id' })
  id: string;

  @ApiProperty({ example: 'uuid-column-id' })
  column_id: string;

  @ApiProperty({ example: 'A comunicação da equipe melhorou muito!' })
  content: string;

  @ApiProperty({ example: 'uuid-user-id', nullable: true })
  author_id: string | null;

  @ApiProperty({ example: 'João Silva', nullable: true })
  author_name: string | null;

  @ApiProperty({ example: false })
  is_anonymous: boolean;

  @ApiProperty({ example: 3 })
  votes_count: number;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  created_at: Date;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  updated_at: Date;
}

export class RetroCardVoteResponseDto {
  @ApiProperty({ example: 'uuid-vote-id' })
  id: string;

  @ApiProperty({ example: 'uuid-card-id' })
  card_id: string;

  @ApiProperty({ example: 'uuid-user-id' })
  user_id: string;

  @ApiProperty({ example: '2024-01-15T10:30:00Z' })
  created_at: Date;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Operation completed successfully' })
  message: string;
}

export class VoteResponseDto {
  @ApiProperty({ example: 'Vote added successfully' })
  message: string;

  @ApiProperty({ type: RetroCardVoteResponseDto })
  vote: RetroCardVoteResponseDto;
}
