import { ApiProperty } from "@nestjs/swagger";
import { RetroColumn } from "src/shared/database/entities/retro-column.entity";

export class RetroColumnResponseDto {
  @ApiProperty({
    description: "ID único da coluna",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "Nome da coluna",
    example: "What went well?",
  })
  title: string;

  @ApiProperty({
    description: "Posição da coluna no board",
    example: 1,
  })
  order_index: number;

  @ApiProperty({
    description: "ID do board ao qual a coluna pertence",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  board_id: string;

  @ApiProperty({
    description: "Data de criação da coluna",
    example: "2024-01-15T10:30:00Z",
  })
  created_at: Date;

  @ApiProperty({
    description: "Data da última atualização da coluna",
    example: "2024-01-15T10:30:00Z",
  })
  updated_at: Date;

  static fromEntity(entity: RetroColumn): RetroColumnResponseDto {
    const dto = new RetroColumnResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.order_index = entity.order_index;
    dto.board_id = entity.board_id;
    dto.created_at = entity.created_at;
    dto.updated_at = entity.updated_at;
    return dto;
  }

  static fromEntities(entities: RetroColumn[]): RetroColumnResponseDto[] {
    return entities.map((entity) => RetroColumnResponseDto.fromEntity(entity));
  }
}
