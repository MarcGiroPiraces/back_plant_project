import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Photo } from '../entities/photo.entity';

@Injectable()
export class PhotoRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
  ) {}

  private initiateQueryBuilder() {
    return this.photoRepository.createQueryBuilder('photo');
  }

  async insert(url: string) {
    const result = await this.initiateQueryBuilder()
      .insert()
      .values({ url })
      .execute();

    return result.identifiers[0].id as number;
  }

  async setRelation(id: number, foreignId: number, relation: string) {
    return await this.initiateQueryBuilder()
      .relation(Photo, relation)
      .of(id)
      .set(foreignId);
  }

  async findByUrl(url: string) {
    return await this.initiateQueryBuilder()
      .where('photo.url = :url', { url })
      .getOne();
  }
}
