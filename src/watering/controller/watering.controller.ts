import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateWateringDto } from '../dto/create-watering.dto';
import { WateringService } from '../service/watering,service';

@Controller('watering')
export class WateringController {
  constructor(private readonly wateringService: WateringService) {}

  @Post()
  create(@Body() createWateringDto: CreateWateringDto) {
    return this.wateringService.create(createWateringDto);
  }

  @Get()
  findAll(@Query('plantId') plantId: string) {
    return this.wateringService.findAll(+plantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wateringService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wateringService.remove(+id);
  }
}