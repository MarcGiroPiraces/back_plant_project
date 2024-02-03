import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlantModule } from './plant/plant.module';
import { SpotModule } from './spot/spot.module';
import { UserModule } from './user/user.module';
import { WateringModule } from './watering/watering.module';
import { TransplantingModule } from './transplanting/transplanting.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [],
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
    UserModule,
    PlantModule,
    SpotModule,
    WateringModule,
    TransplantingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
