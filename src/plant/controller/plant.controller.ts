import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CustomRequest } from 'src/CustomRequest';
import { CreatePlantDto } from '../dto/create-plant.dto';
import { PlantService } from '../service/plant.service';

@Controller('plant')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}

  @Post()
  create(@Body() createPlantDto: CreatePlantDto) {
    return this.plantService.create(createPlantDto);
  }

  @Get()
  findAll(@Query('userId') userId: number) {
    return this.plantService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, request: CustomRequest) {
    console.log(request);
    return this.plantService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plantService.remove(+id);
  }
}