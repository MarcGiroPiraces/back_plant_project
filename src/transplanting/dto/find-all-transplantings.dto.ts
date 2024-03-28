import { IsOptional, IsPositive } from 'class-validator';

export class FindAllTransplantingsParams {
  @IsOptional()
  @IsPositive()
  plantId: number;
}
