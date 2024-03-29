import { IsPositive, IsRFC3339, IsString } from 'class-validator';

export class CreatePlantDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsRFC3339()
  atHomeSince: string;

  @IsPositive()
  spotId: number;
}

export class CreatePlant extends CreatePlantDto {
  userId: number;
}
