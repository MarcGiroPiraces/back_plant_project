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
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { AuthService } from '../../auth/service/auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/find-all-users.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Role } from '../entities/user.entity';
import { UserService } from '../service/user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'User created succesfully.',
    type: Number,
  })
  async createOne(@Body() createUserDto: CreateUserDto) {
    return this.userService.createOne(createUserDto);
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
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: CustomRequest,
  ) {
    const user = req.user;

    return this.userService.updateOne(id, user, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Get all users.',
    type: UserResponseDto,
    isArray: true,
  })
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Get a user by id.',
    type: UserResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: CustomRequest) {
    const user = req.user;

    return this.userService.findOne(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Delete a user by id.',
    type: Boolean,
  })
  removeOne(@Param('id', ParseIntPipe) id: number, @Req() req: CustomRequest) {
    const user = req.user;

    return this.userService.removeOne(id, user);
  }
}
