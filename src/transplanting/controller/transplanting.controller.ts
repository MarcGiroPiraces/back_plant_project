import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTransplantingDto } from '../dto/create-transplanting.dto';
import { TransplantingService } from '../service/transplanting.service';

@Controller('transplanting')
export class TransplantingController {
  constructor(private readonly transplantingService: TransplantingService) {}

  @Post()
  create(@Body() createTransplantingDto: CreateTransplantingDto) {
    return this.transplantingService.create(createTransplantingDto);
  }

  @Get()
  findAll(@Query('plantId') plantId: string) {
    return this.transplantingService.findAll(+plantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transplantingService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transplantingService.remove(+id);
  }
}
