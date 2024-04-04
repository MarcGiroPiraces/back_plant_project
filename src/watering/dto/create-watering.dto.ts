import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsPositive } from 'class-validator';

export class CreateWateringDto {
  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;

  @ApiProperty()
  @IsBoolean()
  fertilizer: boolean;

  @ApiProperty()
  @IsPositive()
  plantId: number;
}
