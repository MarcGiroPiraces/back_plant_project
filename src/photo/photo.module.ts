import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoController } from './controller/photo.controller';
import { Photo } from './entities/photo.entity';
import { PhotoRepository } from './repository/photo.repository';
import { PhotoService } from './service/photo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Photo])],
  providers: [PhotoService, PhotoRepository],
  exports: [PhotoRepository],
  controllers: [PhotoController],
})
export class PhotoModule {}
