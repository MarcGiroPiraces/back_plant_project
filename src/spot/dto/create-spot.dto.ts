import { IsString } from 'class-validator';

export class CreateSpotDto {
  @IsString()
  room: string;

  @IsString()
  place: string;
}
