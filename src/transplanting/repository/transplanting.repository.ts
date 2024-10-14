import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateTransplantingDto } from '../dto/create-transplanting.dto';
import { FindAllTransplantingsParams } from '../dto/find-all-transplantings.dto';
import { Transplanting } from '../entities/transplanting.entity';

@Injectable()
export class TransplantingRepository {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Transplanting)
    private transplantingRepository: Repository<Transplanting>,
  ) {}

  private initiateQueryBuilder() {
    return this.transplantingRepository.createQueryBuilder('transplanting');
  }

  private startTransaction() {
    return this.dataSource.createQueryRunner();
  }

  async insert(
    transplantingData: Omit<CreateTransplantingDto, 'plantId'>,
    relations: { [key: string]: number }[],
  ) {
    const queryRunner = this.startTransaction();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await queryRunner.manager.insert(Transplanting, {
        ...transplantingData,
      });
      const identifiers = result.identifiers;
      const transplantingId = identifiers[0].id as number;

      await Promise.all(
        relations.map(async (relation) => {
          for (const [key, value] of Object.entries(relation)) {
            await this.setRelation(transplantingId, value, key);
          }
        }),
      );

      await queryRunner.commitTransaction();

      return transplantingId;
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
      .relation(Transplanting, relation)
      .of(id)
      .set(foreignId);
  }

  async find(filters: FindAllTransplantingsParams) {
    const { plantId } = filters;

    let query = this.initiateQueryBuilder().innerJoinAndSelect(
      'transplanting.plant',
      'plant',
    );
    if (plantId) {
      query = query.where('plant.id = :plantId', { plantId });
    }

    return await query.orderBy('transplanting.date', 'DESC').getMany();
  }

  async findOne(id: number) {
    return await this.initiateQueryBuilder()
      .innerJoin('transplanting.plant', 'plant')
      .where('transplanting.id = :id', { id })
      .getOne();
  }

  async isTransplantingFromUser(transplantingId: number, userId: number) {
    return await this.initiateQueryBuilder()
      .innerJoin('transplanting.plant', 'plant')
      .innerJoin('plant.user', 'user')
      .where('transplanting.id = :transplantingId', { transplantingId })
      .andWhere('user.id = :userId', { userId })
      .getOne();
  }

  async removeById(id: number) {
    const removedTransplanting = await this.initiateQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();

    return removedTransplanting.affected === 1;
  }
}
