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
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CustomRequest } from '../../CustomRequest';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';
import { AuthService } from '../../auth/service/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../service/user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Create a user.', type: Number })
  async create(@Body() createUserDto: CreateUserDto) {
    const password = await this.authService.hashPassword(
      createUserDto.password,
    );
    createUserDto.password = password;

    return this.userService.create(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUserDto })
  @ApiCreatedResponse({
    description: 'Login a user.',
  })
  async login(@Req() req: CustomRequest) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Update a user by id.',
    type: Number,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: CustomRequest,
  ) {
    const userId = req.user.id;

    return this.userService.update(id, userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Get all users.',
  })
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Get a specific user by id.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Delete a specific user by id.',
    type: Boolean,
  })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: CustomRequest) {
    const userId = req.user.id;

    return this.userService.remove(id, userId);
  }
}
