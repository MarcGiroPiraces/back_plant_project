import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreatePlantDto } from './create-plant.dto';

export class UpdatePlantDto extends PartialType(CreatePlantDto) {}

export class UpdatePlant extends UpdatePlantDto {
  @IsNumber()
  id: number;

  userId: number;
}
