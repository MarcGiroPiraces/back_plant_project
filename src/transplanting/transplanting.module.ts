import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from '../plant/entities/plant.entity';
import { PlantModule } from '../plant/plant.module';
import { TransplantingController } from './controller/transplanting.controller';
import { Transplanting } from './entities/transplanting.entity';
import { TransplantingRepository } from './repository/transplanting.repository';
import { TransplantingService } from './service/transplanting.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transplanting, Plant]), PlantModule],
  controllers: [TransplantingController],
  providers: [TransplantingService, TransplantingRepository],
})
export class TransplantingModule {}
