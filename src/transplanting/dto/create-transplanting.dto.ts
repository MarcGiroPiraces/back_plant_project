import { IsBoolean, IsPositive, IsRFC3339, IsString } from 'class-validator';

export class CreateTransplantingDto {
  @IsRFC3339()
  date: string;

  @IsPositive()
  plantId: number;

  @IsBoolean()
  potUpsize: boolean;

  @IsBoolean()
  soilChange: boolean;

  @IsString()
  soilMix: string;
}
