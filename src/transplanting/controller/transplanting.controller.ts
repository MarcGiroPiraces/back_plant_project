import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomRequest } from 'src/CustomRequest';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateTransplantingDto } from '../dto/create-transplanting.dto';
import {
  FindAllTransplantingsParams,
  TransplantingResponseDto,
} from '../dto/find-all-transplantings.dto';
import { TransplantingService } from '../service/transplanting.service';

@ApiTags('Transplantings')
@ApiBearerAuth()
@Controller('transplanting')
export class TransplantingController {
  constructor(private readonly transplantingService: TransplantingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'Create a transplanting.',
    type: Number,
  })
  create(@Body() createTransplantingDto: CreateTransplantingDto) {
    return this.transplantingService.create(createTransplantingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'Get all transplantings with filter options.',
    type: TransplantingResponseDto,
    isArray: true,
  })
  findAll(
    @Req() req: CustomRequest,
    @Query() filters: FindAllTransplantingsParams,
  ) {
    const requestUser = req.user;

    return this.transplantingService.findAll(requestUser, filters);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    description: 'Get a specific transplanting by id.',
  })
  findOne(@Req() req: CustomRequest, @Param('id', ParseIntPipe) id: number) {
    const requestUser = req.user;

    return this.transplantingService.findOne(requestUser, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete a specific transplanting by id.',
    type: Boolean,
  })
  remove(@Req() req: CustomRequest, @Param('id', ParseIntPipe) id: number) {
    const requestUser = req.user;

    return this.transplantingService.remove(requestUser, id);
  }
}
