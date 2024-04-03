import { Transform } from 'class-transformer';
import { IsDate, IsPositive, IsString } from 'class-validator';

export class CreatePlantDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  atHomeSince: Date;

  @IsPositive()
  spotId: number;
}

export class CreatePlant extends CreatePlantDto {
  userId: number;
}
