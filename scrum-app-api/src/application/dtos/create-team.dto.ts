import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({
    description: 'Nome do time',
    example: 'Time de Desenvolvimento',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição do time',
    example: 'Time responsável pelo desenvolvimento do produto X',
  })
  @IsString()
  @IsOptional()
  description?: string;
} 