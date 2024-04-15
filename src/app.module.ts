import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppContextMiddleware } from './app-context.middleware';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PlantModule } from './plant/plant.module';
import { SpotModule } from './spot/spot.module';
import { TransplantingModule } from './transplanting/transplanting.module';
import { UserModule } from './user/user.module';
import { WateringModule } from './watering/watering.module';

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
    AuthModule,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppContextMiddleware).forRoutes('*');
  }
}
