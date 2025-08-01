import { ApiProperty } from '@nestjs/swagger';

export class RetroColumnResponseDto {
  @ApiProperty({
    description: 'ID único da coluna',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da coluna',
    example: 'What went well?',
  })
  title: string;

  @ApiProperty({
    description: 'Descrição da coluna',
    example: 'Things that worked well during the sprint',
  })
  description: string;

  @ApiProperty({
    description: 'Posição da coluna no board',
    example: 1,
  })
  order_position: number;

  @ApiProperty({
    description: 'ID do board ao qual a coluna pertence',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  board_id: string;

  @ApiProperty({
    description: 'Data de criação da coluna',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Data da última atualização da coluna',
    example: '2024-01-15T10:30:00Z',
  })
  updated_at: Date;
}
