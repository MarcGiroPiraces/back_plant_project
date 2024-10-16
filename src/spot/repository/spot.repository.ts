import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateSpotDto } from '../dto/create-spot.dto';
import { FindAllSpotsParams } from '../dto/find-all-spots.dto';
import { Spot } from '../entities/spot.entity';

@Injectable()
export class SpotRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Spot) private readonly spotRepository: Repository<Spot>,
  ) {}

  private initiateQueryBuilder() {
    return this.spotRepository.createQueryBuilder('spot');
  }

  async createOne(createSpotDto: CreateSpotDto, userId: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdSpot = await queryRunner.manager.insert(Spot, {
        ...createSpotDto,
      });
      const identifiers = createdSpot.identifiers;
      const createdSpotId = identifiers[0].id as number;

      await this.dataSource
        .createQueryBuilder()
        .relation(Spot, 'user')
        .of(createdSpotId)
        .set(userId);
      await queryRunner.commitTransaction();

      return createdSpotId;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return false;
    } finally {
      await queryRunner.release();
    }
  }

  async findByRoomUserAndPlace(room: string, userId: number, place: string) {
    return await this.initiateQueryBuilder()
      .where('spot.room = :room', { room })
      .andWhere('spot.user = :userId', { userId })
      .andWhere('spot.place = :place', { place })
      .getOne();
  }

  async findOne(filters: FindAllSpotsParams) {
    const { userId } = filters;

    let query = this.initiateQueryBuilder()
      .leftJoinAndSelect('spot.user', 'user')
      .leftJoinAndSelect('spot.plants', 'plants');

    if (userId) {
      query = query.where('spot.user = :userId', { userId });
    }

    return await query.getMany();
  }

  async findOneById(id: number) {
    return await this.initiateQueryBuilder()
      .leftJoinAndSelect('spot.user', 'user')
      .leftJoinAndSelect('spot.plants', 'plants')
      .where('spot.id = :id', { id })
      .getOne();
  }

  async removeOne(id: number) {
    const removedSpot = await this.initiateQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();

    return removedSpot.affected === 1;
  }
}
