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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomRequest } from '../../CustomRequest';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateSpotDto } from '../dto/create-spot.dto';
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

    return this.spotService.create({ userId, ...createSpotDto });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'Get all spots.',
  })
  findAll(@Req() req: CustomRequest) {
    const userId = req.user.id;

    return this.spotService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({
    description: 'Get a specific spot by id.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.spotService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOkResponse({
    description: 'Delete a specific spot by id.',
    type: Boolean,
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.spotService.remove(id);
  }
}
