import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FindAllPlantsParams {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  spotId: number;
}

export class FindAllPlants extends FindAllPlantsParams {
  userId: number;
}
