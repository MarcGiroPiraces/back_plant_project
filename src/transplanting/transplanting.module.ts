import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from '../plant/entities/plant.entity';
import { TransplantingController } from './controller/transplanting.controller';
import { Transplanting } from './entities/transplanting.entity';
import { TransplantingService } from './service/transplanting.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transplanting, Plant])],
  controllers: [TransplantingController],
  providers: [TransplantingService],
})
export class TransplantingModule {}
