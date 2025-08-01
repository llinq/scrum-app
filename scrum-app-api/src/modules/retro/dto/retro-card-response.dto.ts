import { ApiProperty } from '@nestjs/swagger';

export class RetroCardResponseDto {
  @ApiProperty({
    description: 'ID único do card',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Conteúdo do card',
    example: 'Great team communication during the sprint',
  })
  content: string;

  @ApiProperty({
    description: 'Indica se o card é anônimo',
    example: false,
  })
  is_anonymous: boolean;

  @ApiProperty({
    description: 'Número de votos recebidos',
    example: 3,
  })
  vote_count: number;

  @ApiProperty({
    description: 'ID da coluna à qual o card pertence',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  column_id: string;

  @ApiProperty({
    description: 'ID do autor do card (null se anônimo)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  author_id: string | null;

  @ApiProperty({
    description: 'Data de criação do card',
    example: '2024-01-15T10:30:00Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Data da última atualização do card',
    example: '2024-01-15T10:30:00Z',
  })
  updated_at: Date;
}
