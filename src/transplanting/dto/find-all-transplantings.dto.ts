import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindAllTransplantingsParams {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  plantId: number;
}
