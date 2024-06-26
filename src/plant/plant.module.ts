import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from '../photo/entities/photo.entity';
import { PhotoModule } from '../photo/photo.module';
import { Spot } from '../spot/entities/spot.entity';
import { SpotModule } from '../spot/spot.module';
import { Transplanting } from '../transplanting/entities/transplanting.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Watering } from '../watering/entities/watering.entity';
import { PlantController } from './controller/plant.controller';
import { Plant } from './entities/plant.entity';
import { PlantRepository } from './repository/plant.repository';
import { PlantService } from './service/plant.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Plant,
      Transplanting,
      User,
      Spot,
      Watering,
      Photo,
    ]),
    UserModule,
    SpotModule,
    PhotoModule,
  ],
  controllers: [PlantController],
  providers: [PlantService, PlantRepository],
  exports: [PlantService],
})
export class PlantModule {}
