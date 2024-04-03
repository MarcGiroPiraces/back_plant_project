import { PartialType } from '@nestjs/mapped-types';
import { CreatePlantDto } from './create-plant.dto';

export class UpdatePlantDto extends PartialType(CreatePlantDto) {}

export class UpdatePlant extends UpdatePlantDto {
  id: number;
  userId: number;
}
