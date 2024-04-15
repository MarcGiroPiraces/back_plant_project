import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';
import { SpotWithoutDetails } from '../../spot/dto/find-all-spots.dto';
import { TransplantingWithoutDetails } from '../../transplanting/dto/find-all-transplantings.dto';
import { WateringWithoutDetails } from '../../watering/dto/find-all-waterings.dto';

export class FindAllPlantsParams {
  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  spotId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  userId: number;
}

export class PlantResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  atHomeSince: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: WateringWithoutDetails, isArray: true })
  waterings: WateringWithoutDetails[];

  @ApiProperty({ type: TransplantingWithoutDetails, isArray: true })
  transplantings: TransplantingWithoutDetails[];

  @ApiProperty({ type: () => SpotWithoutDetails })
  spot: SpotWithoutDetails;
}

export class PlantWithoutDetails extends OmitType(PlantResponseDto, [
  'waterings',
  'transplantings',
  'spot',
]) {}
