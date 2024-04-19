import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Photo } from '../photo/entities/photo.entity';
import { Plant } from '../plant/entities/plant.entity';
import { Spot } from '../spot/entities/spot.entity';
import { UserController } from './controller/user.controller';
import { User } from './entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { UserService } from './service/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Plant, Spot, Photo]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
