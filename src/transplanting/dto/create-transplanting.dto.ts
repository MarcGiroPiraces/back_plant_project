import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsPositive, IsString } from 'class-validator';

export class CreateTransplantingDto {
  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;

  @ApiProperty()
  @IsPositive()
  plantId: number;

  @ApiProperty()
  @IsBoolean()
  potUpsize: boolean;

  @ApiProperty()
  @IsBoolean()
  soilChange: boolean;

  @ApiProperty()
  @IsString()
  soilMix: string;
}
