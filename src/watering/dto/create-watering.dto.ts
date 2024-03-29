import { IsBoolean, IsPositive, IsRFC3339 } from 'class-validator';

export class CreateWateringDto {
  @IsRFC3339()
  date: string;

  @IsBoolean()
  fertilizer: boolean;

  @IsPositive()
  plantId: number;
}
