import { IsString, IsBoolean, IsOptional, IsInt, Min, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRetroBoardDto {
  @ApiProperty({
    description: 'Título do board de retrospectiva',
    example: 'Sprint 15 Retrospectiva',
    maxLength: 255
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Permite votação nos cards',
    example: true,
    required: false,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  allow_voting?: boolean;

  @ApiProperty({
    description: 'Número máximo de votos por usuário',
    example: 5,
    minimum: 1,
    required: false,
    default: 5
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : Number(value))
  max_votes_per_user?: number;

  @ApiProperty({
    description: 'Exibe o nome do autor dos cards',
    example: true,
    required: false,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  show_author?: boolean;

  @ApiProperty({
    description: 'Permite cards anônimos',
    example: false,
    required: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  allow_anonymous?: boolean;
}
