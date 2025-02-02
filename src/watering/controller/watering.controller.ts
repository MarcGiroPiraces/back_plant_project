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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateWateringDto } from '../dto/create-watering.dto';
import {
  FindAllWateringsParams,
  WateringResponseDto,
} from '../dto/find-all-waterings.dto';
import { WateringService } from '../service/watering,service';

@ApiTags('Waterings')
@ApiBearerAuth()
@Controller('watering')
export class WateringController {
  constructor(private readonly wateringService: WateringService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'Create a watering.',
    type: Number,
  })
  createOne(@Body() createWateringDto: CreateWateringDto) {
    return this.wateringService.create(createWateringDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'Get all waterings with filter options.',
    type: WateringResponseDto,
    isArray: true,
  })
  findAll(@Query() { plantId }: FindAllWateringsParams) {
    return this.wateringService.findAll(plantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    description: 'Get a specific watering by id.',
    type: WateringResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.wateringService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete a specific watering by id.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.wateringService.remove(id);
  }
}
