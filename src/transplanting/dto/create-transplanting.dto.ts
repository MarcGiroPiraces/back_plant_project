import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateTransplantingDto {
  @IsString()
  date: string;

  @IsNumber()
  plantId: number;

  @IsBoolean()
  potUpsize: boolean;

  @IsBoolean()
  soilChange: boolean;

  @IsString()
  soilMix: string;
}
