import {
  IsString,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
  MaxLength,
} from "class-validator";
import { Transform } from "class-transformer";

export class UpdateRetroBoardDto {
  @IsOptional()
  @IsString({ always: false })
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsBoolean({ always: false })
  @Transform(({ value }) => value === "true" || value === true)
  allow_voting?: boolean;

  @IsOptional()
  @IsInt({ always: false })
  @Min(1)
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === "") return undefined;
    return typeof value === "string" ? parseInt(value, 10) : Number(value);
  })
  max_votes_per_user?: number;

  @IsOptional()
  @IsBoolean({ always: false })
  @Transform(({ value }) => value === "true" || value === true)
  show_author?: boolean;

  @IsOptional()
  @IsBoolean({ always: false })
  @Transform(({ value }) => value === "true" || value === true)
  allow_anonymous?: boolean;

  @IsOptional()
  @IsBoolean({ always: false })
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === "") return undefined;
    return typeof value === "boolean" ? value : Boolean(value);
  })
  is_active?: boolean;
}
