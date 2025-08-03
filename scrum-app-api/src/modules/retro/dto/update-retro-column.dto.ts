import { IsString, IsInt, IsOptional, MaxLength, Min } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateRetroColumnDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsInt({ always: false })
  @Min(0)
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === "") return undefined;
    return typeof value === "string" ? parseInt(value, 10) : Number(value);
  })
  orderIndex?: number;
}
