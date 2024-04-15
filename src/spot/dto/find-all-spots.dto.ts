import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import { PlantWithoutDetails } from '../../plant/dto/find-all-plants.dto';
import { UserResponseDto } from '../../user/dto/find-all-users.dto';

export class FindAllSpotsParams {
  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => parseInt(value))
  userId: number;
}

export class SpotResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  room: string;

  @ApiProperty()
  place: string;

  @ApiProperty({ type: () => PlantWithoutDetails, isArray: true })
  plants: PlantWithoutDetails[];

  @ApiProperty()
  user: UserResponseDto;
}

export class SpotWithoutDetails extends OmitType(SpotResponseDto, [
  'plants',
  'user',
]) {}
