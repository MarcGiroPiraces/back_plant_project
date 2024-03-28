import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateWateringDto {
  @IsString()
  date: string;

  @IsBoolean()
  fertilizer: boolean;

  @IsNumber()
  plantId: number;
}
