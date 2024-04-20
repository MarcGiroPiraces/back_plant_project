import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Relation } from 'typeorm';
import { PlantWithoutDetails } from '../../plant/dto/find-all-plants.dto';

export class FindAllTransplantingsParams {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  plantId: number;
}

export class TransplantingResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  date: Date;

  @ApiProperty({ type: () => PlantWithoutDetails })
  plant: Relation<PlantWithoutDetails>;

  @ApiProperty()
  potUpSize: boolean;

  @ApiProperty()
  soilChange: boolean;

  @ApiProperty()
  soilMix: string;
}

export class TransplantingWithoutDetails extends OmitType(
  TransplantingResponseDto,
  ['plant'],
) {}
