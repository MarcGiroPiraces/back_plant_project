import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateTransplantingDto } from '../dto/create-transplanting.dto';
import { FindAllTransplantingsParams } from '../dto/find-all-transplantings.dto';
import { TransplantingService } from '../service/transplanting.service';

@Controller('transplanting')
export class TransplantingController {
  constructor(private readonly transplantingService: TransplantingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTransplantingDto: CreateTransplantingDto) {
    return this.transplantingService.create(createTransplantingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() { plantId }: FindAllTransplantingsParams) {
    const filters = {
      plantId: plantId ? plantId : null,
    };

    return this.transplantingService.findAll(filters);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.transplantingService.findOne(id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.transplantingService.remove(id);
  }
}
