import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsPositive, IsString } from 'class-validator';

export class CreatePlantDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  atHomeSince: Date;

  @ApiProperty()
  @IsPositive()
  spotId: number;

  @ApiPropertyOptional()
  photoId: number;
}
