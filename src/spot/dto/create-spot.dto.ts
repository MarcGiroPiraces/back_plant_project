import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateSpotDto {
  @ApiProperty()
  @IsString()
  room: string;

  @ApiProperty()
  @IsString()
  place: string;
}
