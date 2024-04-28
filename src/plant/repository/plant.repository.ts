import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PhotoRepository } from '../../photo/repository/photo.repository';
import { CreatePlantDto } from '../dto/create-plant.dto';
import { FindAllPlantsParams } from '../dto/find-all-plants.dto';
import { Plant } from '../entities/plant.entity';

@Injectable()
export class PlantRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Plant) private plantRepository: Repository<Plant>,
    @Inject(PhotoRepository) private photoRepository: PhotoRepository,
  ) {}

  private initiateQueryBuilder() {
    return this.plantRepository.createQueryBuilder('plant');
  }

  private startTransaction() {
    return this.dataSource.createQueryRunner();
  }

  async insert(
    plantData: Omit<CreatePlantDto, 'spotId' | 'photoId'>,
    createdAt: Date,
    relations: { [key: string]: number }[],
  ) {
    const queryRunner = this.startTransaction();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager.insert(Plant, {
        ...plantData,
        createdAt,
      });
      const identifiers = result.identifiers;
      const plantId = identifiers[0].id as number;

      await Promise.all(
        relations.map(async (relation) => {
          for (const [key, value] of Object.entries(relation)) {
            if (key === 'photos') {
              await this.addRelation(plantId, value, key);
            } else {
              await this.setRelation(plantId, value, key);
            }
          }
        }),
      );

      await queryRunner.commitTransaction();

      return plantId;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  private async setRelation(id: number, foreignId: number, relation: string) {
    return await this.dataSource
      .createQueryBuilder()
      .relation(Plant, relation)
      .of(id)
      .set(foreignId);
  }

  private async addRelation(id: number, foreignId: number, relation: string) {
    return await this.dataSource
      .createQueryBuilder()
      .relation(Plant, relation)
      .of(id)
      .add(foreignId);
  }

  async findByNameAndUserId(name: string, userId: number) {
    return await this.initiateQueryBuilder()
      .where('plant.name = :name', { name })
      .andWhere('plant.user = :userId', { userId })
      .getOne();
  }

  async findByIdLimitedData(id: number, userId: number) {
    return await this.initiateQueryBuilder()
      .where('plant.id = :id', { id })
      .andWhere('plant.user = :userId', { userId })
      .getOne();
  }

  async findById(id: number) {
    return await this.initiateQueryBuilder()
      .leftJoinAndSelect('plant.waterings', 'waterings')
      .leftJoinAndSelect('plant.transplantings', 'transplantings')
      .where('plant.id = :id', { id })
      .getOne();
  }

  async findByIdAndUserId(id: number, userId: number) {
    return await this.initiateQueryBuilder()
      .where('plant.id = :id', { id })
      .andWhere('plant.user = :userId', { userId })
      .getOne();
  }

  async find(filters: FindAllPlantsParams) {
    const { userId, spotId } = filters;

    let query = this.initiateQueryBuilder()
      .leftJoinAndSelect('plant.waterings', 'watering')
      .leftJoinAndSelect('plant.transplantings', 'transplantings')
      .leftJoinAndSelect('plant.spot', 'spot');
    if (userId) {
      query = query.where('plant.user = :userId', { userId });
    }
    if (spotId) {
      query = query.where('plant.spot = :spotId', { spotId });
    }

    return await query.getMany();
  }

  async updateById(id: number, plantData: Partial<Plant>, spotId: number) {
    const queryRunner = this.startTransaction();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.dataSource
        .createQueryBuilder()
        .update(Plant)
        .set({ ...plantData })
        .where('id = :id', { id })
        .execute();
      await this.setRelation(id, spotId, 'spot');

      await queryRunner.commitTransaction();

      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return false;
    } finally {
      await queryRunner.release();
    }
  }

  async removeById(id: number) {
    const removedPlant = await this.initiateQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();

    return removedPlant.affected === 1;
  }
}
