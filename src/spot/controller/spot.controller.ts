import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateSpotDto } from '../dto/create-spot.dto';
import { SpotService } from '../service/spot.service';

@Controller('spot')
export class SpotController {
  constructor(private readonly spotService: SpotService) {}

  @Post()
  create(@Body() createSpotDto: CreateSpotDto) {
    return this.spotService.create(createSpotDto);
  }

  @Get()
  findAll(@Query('userId') userId: number) {
    return this.spotService.findAll(userId ? Number(userId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spotService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spotService.remove(+id);
  }
}
