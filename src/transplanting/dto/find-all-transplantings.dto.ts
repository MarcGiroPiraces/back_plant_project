import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindAllTransplantingsParams {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  plantId: number;
}
