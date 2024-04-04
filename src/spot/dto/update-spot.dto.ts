import { PartialType } from '@nestjs/swagger';
import { CreatePlantDto } from '../../plant/dto/create-plant.dto';

export class UpdateSpotDto extends PartialType(CreatePlantDto) {}
