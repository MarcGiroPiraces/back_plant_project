import { Transform } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class FindAllPlantsDto {
  @IsOptional()
  @IsPositive()
  userId: number;

  @IsOptional()
  @IsPositive()
  spotId: number;
}

export class FindAllPlantsParams {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  spotId: number;
}
