import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRetroCardDto {
  @ApiProperty({
    description: 'Conteúdo do card',
    example: 'A comunicação da equipe melhorou muito esta sprint!'
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Nome do autor (para guests ou modo anônimo)',
    example: 'João Silva',
    maxLength: 255,
    required: false
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  author_name?: string;

  @ApiProperty({
    description: 'Indica se o card é anônimo',
    example: false,
    required: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isAnonymous?: boolean;
}
