import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from '../plant/entities/plant.entity';
import { WateringController } from './controller/watering.controller';
import { Watering } from './entities/watering.entity';
import { WateringService } from './service/watering,service';

@Module({
  imports: [TypeOrmModule.forFeature([Watering, Plant])],
  controllers: [WateringController],
  providers: [WateringService],
})
export class WateringModule {}
