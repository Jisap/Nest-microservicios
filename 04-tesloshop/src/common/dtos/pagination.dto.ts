import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {

  @IsOptional()
  @IsPositive()
  @Type(() => Number) // Nos permite transformar los query params de la url de strings a number
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;
}