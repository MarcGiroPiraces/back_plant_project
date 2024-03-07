import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateWateringDto } from '../dto/create-watering.dto';
import { WateringService } from '../service/watering,service';

@Controller('watering')
export class WateringController {
  constructor(private readonly wateringService: WateringService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createWateringDto: CreateWateringDto) {
    return this.wateringService.create(createWateringDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('plantId') plantId: string) {
    return this.wateringService.findAll(+plantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wateringService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wateringService.remove(+id);
  }
}
