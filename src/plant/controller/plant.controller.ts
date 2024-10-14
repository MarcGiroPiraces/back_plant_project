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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomRequest } from '../../CustomRequest';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreatePlantDto } from '../dto/create-plant.dto';
import {
  FindAllPlantsParams,
  PlantResponseDto,
} from '../dto/find-all-plants.dto';
import { UpdatePlantDto } from '../dto/update-plant.dto';
import { PlantService } from '../service/plant.service';

@ApiTags('Plants')
@ApiBearerAuth()
@Controller('plant')
export class PlantController {
  constructor(private plantService: PlantService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'Create a plant.',
    type: Number,
  })
  create(@Req() req: CustomRequest, @Body() createPlantDto: CreatePlantDto) {
    const requestUser = req.user;

    return this.plantService.create(requestUser, createPlantDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOkResponse({
    description: 'Update a plant by id.',
    type: Number,
  })
  update(
    @Req() req: CustomRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePlantDto: UpdatePlantDto,
  ) {
    const user = req.user;

    return this.plantService.update(user, id, updatePlantDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'Get all plants with filter options.',
    type: PlantResponseDto,
    isArray: true,
  })
  findAll(@Req() req: CustomRequest, @Query() filters: FindAllPlantsParams) {
    const requestUser = req.user;

    return this.plantService.findAll(requestUser, filters);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    description: 'Get a plant by id.',
    type: PlantResponseDto,
    isArray: true,
  })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: CustomRequest) {
    const user = req.user;

    return this.plantService.findOne(user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete a plant by id.',
    type: Boolean,
  })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: CustomRequest) {
    const user = req.user;

    return this.plantService.remove(user, id);
  }
}
