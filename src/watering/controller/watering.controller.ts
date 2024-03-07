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
  UsePipes,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../pipes/ZodValidation.pipe';
import {
  CreateWateringDto,
  createWateringDtoSchema,
} from '../dto/create-watering.dto';
import { WateringService } from '../service/watering,service';

@Controller('watering')
export class WateringController {
  constructor(private readonly wateringService: WateringService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(createWateringDtoSchema))
  create(@Body() createWateringDto: CreateWateringDto) {
    return this.wateringService.create(createWateringDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('plantId', new ParseIntPipe()) plantId: string) {
    return this.wateringService.findAll(+plantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: string) {
    return this.wateringService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: string) {
    return this.wateringService.remove(+id);
  }
}
