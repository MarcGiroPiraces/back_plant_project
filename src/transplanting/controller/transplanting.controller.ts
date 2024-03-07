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
  CreateTransplantingDto,
  createTransplantingDtoSchema,
} from '../dto/create-transplanting.dto';
import { TransplantingService } from '../service/transplanting.service';

@Controller('transplanting')
export class TransplantingController {
  constructor(private readonly transplantingService: TransplantingService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ZodValidationPipe(createTransplantingDtoSchema))
  create(@Body() createTransplantingDto: CreateTransplantingDto) {
    return this.transplantingService.create(createTransplantingDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('plantId', new ParseIntPipe()) plantId: string) {
    return this.transplantingService.findAll(+plantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', new ParseIntPipe()) id: string) {
    return this.transplantingService.findOne(+id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: string) {
    return this.transplantingService.remove(+id);
  }
}
