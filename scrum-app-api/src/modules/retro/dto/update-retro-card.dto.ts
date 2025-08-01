import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateRetroCardDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  author_name?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  is_anonymous?: boolean;
}
