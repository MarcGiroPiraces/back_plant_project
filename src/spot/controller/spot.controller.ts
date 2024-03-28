import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomRequest } from '../../CustomRequest';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateSpotDto } from '../dto/create-spot.dto';
import { SpotService } from '../service/spot.service';

@Controller('spot')
export class SpotController {
  constructor(private readonly spotService: SpotService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSpotDto: CreateSpotDto, @Req() req: CustomRequest) {
    const userId = req.user.id;

    return this.spotService.create({ userId, ...createSpotDto });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: CustomRequest) {
    const userId = req.user.id;

    return this.spotService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.spotService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.spotService.remove(id);
  }
}
