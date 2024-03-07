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
import { CreateSpotDto } from '../dto/create-spot.dto';
import { SpotService } from '../service/spot.service';

@Controller('spot')
export class SpotController {
  constructor(private readonly spotService: SpotService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSpotDto: CreateSpotDto) {
    return this.spotService.create(createSpotDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('userId') userId: number) {
    return this.spotService.findAll(userId ? Number(userId) : undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spotService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spotService.remove(+id);
  }
}
