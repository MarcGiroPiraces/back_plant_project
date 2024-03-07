import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
  Query,
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
  create(@Body() createPlantDto: CreatePlantDto, @Req() req: CustomRequest) {
    if (createPlantDto.userId !== req.user.id) {
      throw new HttpException('You can only create plants for your user.', 403);
    }
    return this.plantService.create(createPlantDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('userId', new ParseIntPipe()) userId: number) {
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
