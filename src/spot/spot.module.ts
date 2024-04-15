import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plant } from '../plant/entities/plant.entity';
import { User } from '../user/entities/user.entity';
import { SpotController } from './controller/spot.controller';
import { Spot } from './entities/spot.entity';
import { SpotRepository } from './repository/spot.repository';
import { SpotService } from './service/spot.service';

@Module({
  imports: [TypeOrmModule.forFeature([Spot, User, Plant])],
  controllers: [SpotController],
  providers: [SpotService, SpotRepository],
  exports: [SpotService],
})
export class SpotModule {}
