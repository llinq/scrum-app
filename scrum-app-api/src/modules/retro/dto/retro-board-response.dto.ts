import { ApiProperty } from "@nestjs/swagger";
import { RetroBoard } from "src/shared/database/entities/retro-board.entity";

export class RetroBoardResponseDto {
  @ApiProperty({ example: "uuid-board-id" })
  id: string;

  @ApiProperty({ example: "Sprint 15 Retrospectiva" })
  title: string;

  @ApiProperty({ example: "uuid-user-id" })
  created_by: string;

  @ApiProperty({ example: "2024-01-15T10:30:00Z" })
  created_at: Date;

  @ApiProperty({ example: "2024-01-15T10:30:00Z" })
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

  @ApiProperty({ example: false })
  can_edit: boolean;

  static fromEntity(entity: RetroBoard): RetroBoardResponseDto {
    const dto = new RetroBoardResponseDto();
    dto.id = entity.id;
    dto.title = entity.title;
    dto.created_by = entity.created_by;
    dto.created_at = entity.created_at;
    dto.updated_at = entity.updated_at;
    dto.allow_voting = entity.allow_voting;
    dto.max_votes_per_user = entity.max_votes_per_user;
    dto.show_author = entity.show_author;
    dto.allow_anonymous = entity.allow_anonymous;
    dto.is_active = entity.is_active;
    dto.archived_at = entity.archived_at;
    dto.can_edit = false;
    return dto;
  }

  static fromEntities(entities: RetroBoard[]): RetroBoardResponseDto[] {
    return entities.map((entity) => RetroBoardResponseDto.fromEntity(entity));
  }
}
