import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ example: 'loguimarc@gmail.com' })
  email: string;

  @ApiProperty({ example: '1234' })
  password: string;
}
