import { ApiProperty } from "@nestjs/swagger";
import { RetroCard } from "../../../shared/database/entities/retro-card.entity";

export class RetroCardResponseDto {
  @ApiProperty({
    description: "ID único do card",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "Conteúdo do card",
    example: "Great team communication during the sprint",
  })
  content: string;

  @ApiProperty({
    description: "Indica se o card é anônimo",
    example: false,
  })
  is_anonymous: boolean;

  @ApiProperty({
    description: "Número de votos recebidos",
    example: 3,
  })
  vote_count: number;

  @ApiProperty({
    description: "ID da coluna à qual o card pertence",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  column_id: string;

  @ApiProperty({
    description: "Data de criação do card",
    example: "2024-01-15T10:30:00Z",
  })
  created_at: Date;

  @ApiProperty({
    description: "Data da última atualização do card",
    example: "2024-01-15T10:30:00Z",
  })
  updated_at: Date;

  @ApiProperty({
    description: "ID do autor do card (null se anônimo)",
    example: "123e4567-e89b-12d3-a456-426614174000",
    nullable: true,
  })
  author_id: string | null;

  @ApiProperty({
    description: "Nome do autor do card (null se anônimo)",
    example: "John Doe",
    nullable: true,
  })
  author_name: string | null;

  @ApiProperty({
    description: "Número de votos recebidos pelo card",
    example: 5,
  })
  votes_count: number;

  @ApiProperty({
    description: "Indica se o usuário atual pode editar o card",
    example: true,
  })
  can_edit: boolean;

  static fromEntity(
    entity: RetroCard,
    currentUserId: string,
    options: {
      includeAuthor?: boolean;
      checkPermissions?: boolean;
    } = {
      includeAuthor: true,
      checkPermissions: false,
    }
  ): RetroCardResponseDto {
    const instance = new RetroCardResponseDto();
    instance.id = entity.id;
    instance.column_id = entity.column_id;
    instance.content = entity.content;
    instance.is_anonymous = entity.is_anonymous;
    instance.votes_count = entity.votes_count;
    instance.created_at = entity.created_at;
    instance.updated_at = entity.updated_at;

    if (options.checkPermissions && currentUserId) {
      instance.can_edit = entity.author_id === currentUserId;
    } else {
      instance.can_edit = false;
    }

    if (options.includeAuthor) {
      instance.author_id = entity.author_id;
      instance.author_name = entity.author_name;
    } else {
      instance.author_id = null;
      instance.author_name = null;
    }

    return instance;
  }

  static fromEntities(
    entities: RetroCard[],
    currentUserId: string,
    options: { includeAuthor?: boolean; checkPermissions?: boolean } = {
      includeAuthor: true,
      checkPermissions: false,
    }
  ): RetroCardResponseDto[] {
    return entities.map((entity) =>
      RetroCardResponseDto.fromEntity(entity, currentUserId, options)
    );
  }
}
