import { IsNumber, IsString } from 'class-validator';

export class CreatePlantDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  atHomeSince: string;

  @IsNumber()
  spot: number;
}

export class CreatePlant extends CreatePlantDto {
  @IsNumber()
  user: number;
}
