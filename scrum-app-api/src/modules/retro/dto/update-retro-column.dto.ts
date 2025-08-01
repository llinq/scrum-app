import { IsString, IsInt, IsOptional, MaxLength, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateRetroColumnDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => typeof value === 'string' ? parseInt(value, 10) : Number(value))
  orderIndex?: number;
}
