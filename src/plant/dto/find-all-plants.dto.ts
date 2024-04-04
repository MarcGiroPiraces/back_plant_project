import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class FindAllPlantsParams {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  spotId: number;
}

export class FindAllPlants extends FindAllPlantsParams {
  userId: number;
}
