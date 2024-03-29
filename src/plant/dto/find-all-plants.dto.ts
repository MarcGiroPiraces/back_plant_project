import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindAllPlantsParams {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  spotId: number;
}

export class FindAllPlants extends FindAllPlantsParams {
  userId: number;
}
