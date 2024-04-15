import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { CreateSpotDto } from '../dto/create-spot.dto';
import { FindAllSpotsParams, SpotResponseDto } from '../dto/find-all-spots.dto';
import { SpotService } from '../service/spot.service';

@ApiTags('Spots')
@ApiBearerAuth()
@Controller('spot')
export class SpotController {
  constructor(private readonly spotService: SpotService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiCreatedResponse({
    description: 'Create a spot.',
    type: Number,
  })
  create(@Body() createSpotDto: CreateSpotDto, @Req() req: CustomRequest) {
    const userId = req.user.id;

    return this.spotService.create(userId, createSpotDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'Get all spots.',
    type: SpotResponseDto,
    isArray: true,
  })
  findAll(@Query() filters: FindAllSpotsParams, @Req() req: CustomRequest) {
    const user = req.user;

    return this.spotService.findAll(user, filters);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    description: 'Get a specific spot by id.',
    type: SpotResponseDto,
  })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: CustomRequest) {
    const user = req.user;

    return this.spotService.findOne(user, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete a specific spot by id.',
    type: Boolean,
  })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: CustomRequest) {
    const user = req.user;

    return this.spotService.remove(user, id);
  }
}
