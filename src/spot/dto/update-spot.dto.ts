import { PartialType } from '@nestjs/mapped-types';
import { CreatePlantDto } from '../../plant/dto/create-plant.dto';

export class UpdateSpotDto extends PartialType(CreatePlantDto) {}
