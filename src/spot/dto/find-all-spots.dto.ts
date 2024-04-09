import { ApiProperty } from '@nestjs/swagger';
import { PlantWithoutDetails } from '../../plant/dto/find-all-plants.dto';
import { UserResponseDto } from '../../user/dto/find-all-users.dto';

export class SpotResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  room: string;

  @ApiProperty()
  place: string;

  @ApiProperty({ type: () => PlantWithoutDetails, isArray: true })
  plants: PlantWithoutDetails[];

  @ApiProperty()
  user: UserResponseDto;
}
