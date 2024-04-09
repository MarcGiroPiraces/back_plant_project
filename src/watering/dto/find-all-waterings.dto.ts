import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { PlantWithoutDetails } from '../../plant/dto/find-all-plants.dto';

export class FindAllWateringsParams {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  plantId: number;
}

export class WateringResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  fertilizer: boolean;

  @ApiProperty({ type: () => PlantWithoutDetails })
  plant: PlantWithoutDetails;
}

export class WateringWithoutDetails extends OmitType(WateringResponseDto, [
  'plant',
]) {}
