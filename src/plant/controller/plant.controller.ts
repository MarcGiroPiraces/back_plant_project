import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CustomRequest } from '../../CustomRequest';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePlantDto } from '../dto/create-plant.dto';
import { FindAllPlantsParams } from '../dto/find-all-plants.dto';
import { UpdatePlantDto } from '../dto/update-plant.dto';
import { PlantService } from '../service/plant.service';

@Controller('plant')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPlantDto: CreatePlantDto, @Req() req: CustomRequest) {
    const userId = req.user.id;
    const plantData = { ...createPlantDto, userId };
    console.log(plantData);

    return this.plantService.create(plantData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Body() updatePlantDto: UpdatePlantDto,
    @Param('id', ParseIntPipe) id: number,
    @Req() req: CustomRequest,
  ) {
    const userId = req.user.id;
    const plantData = { ...updatePlantDto, id, userId };

    return this.plantService.update(plantData);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: CustomRequest, @Query() { spotId }: FindAllPlantsParams) {
    const userId = req.user.id;
    const filters = { userId, spotId };

    return this.plantService.findAll(filters);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.plantService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.plantService.remove(id);
  }
}
