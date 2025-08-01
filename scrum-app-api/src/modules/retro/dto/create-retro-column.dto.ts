import { IsString, IsInt, IsOptional, MaxLength, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRetroColumnDto {
  @ApiProperty({
    description: 'Título da coluna',
    example: 'O que foi bem?',
    maxLength: 255
  })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Índice de ordenação da coluna (opcional)',
    example: 0,
    minimum: 0,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : Number(value))
  orderIndex?: number;
}
