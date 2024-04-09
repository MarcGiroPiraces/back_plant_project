import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppContextMiddleware } from './app-context.middleware';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RolesGuard } from './auth/guards/roles.guard';
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
  providers: [AppService, { provide: APP_GUARD, useClass: RolesGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppContextMiddleware).forRoutes('*');
  }
}
