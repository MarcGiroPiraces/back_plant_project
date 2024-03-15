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
  UsePipes,
} from '@nestjs/common';
import { CustomRequest } from '../../CustomRequest';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ZodValidationPipe } from '../../pipes/ZodValidation.pipe';
import { CreatePlantDto, createPlantDtoSchema } from '../dto/create-plant.dto';
import { PlantService } from '../service/plant.service';

@Controller('plant')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(createPlantDtoSchema))
  create(
    @Body() createPlantDto: CreatePlantDto & { userId: number },
    @Req() req: CustomRequest,
  ) {
    createPlantDto.userId = req.user.id;
    return this.plantService.create(createPlantDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: CustomRequest) {
    const userId = req.user.id;
    return this.plantService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: string) {
    return this.plantService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: string) {
    return this.plantService.remove(+id);
  }
}
