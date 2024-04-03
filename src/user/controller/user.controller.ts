import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomRequest } from '../../CustomRequest';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';
import { AuthService } from '../../auth/service/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const password = await this.authService.hashPassword(
      createUserDto.password,
    );
    createUserDto.password = password;

    return this.userService.create(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: CustomRequest) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: CustomRequest,
  ) {
    const userId = req.user.id;

    return this.userService.update(id, userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: CustomRequest) {
    const userId = req.user.id;

    return this.userService.remove(id, userId);
  }
}
