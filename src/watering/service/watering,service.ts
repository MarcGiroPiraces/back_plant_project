import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWateringDto } from '../dto/create-watering.dto';
import { Watering } from '../entities/watering.entity';

@Injectable()
export class WateringService {
  constructor(
    @InjectRepository(Watering)
    private wateringRepository: Repository<Watering>,
  ) {}
  async create(createWateringDto: CreateWateringDto) {
    createWateringDto.date = new Date(createWateringDto.date).toISOString();

    const isWateringRegistered = await this.wateringRepository
      .createQueryBuilder('watering')
      .where('watering.date = :date', { date: createWateringDto.date })
      .andWhere('watering.plantId = :plantId', {
        plantId: createWateringDto.plantId,
      })
      .getOne();
    if (isWateringRegistered) {
      throw new HttpException(
        'Plant already watered today.',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const { identifiers } = await this.wateringRepository
        .createQueryBuilder()
        .insert()
        .into(Watering)
        .values(createWateringDto)
        .execute();

      const newWateringId = identifiers[0].id as number;
      await this.wateringRepository
        .createQueryBuilder('watering')
        .relation(Watering, 'plant')
        .of(newWateringId)
        .set(createWateringDto.plantId);

      return newWateringId;
    } catch (error) {
      throw new HttpException(
        'Error while watering the plant.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(plantId: number) {
    let baseQuery = this.wateringRepository
      .createQueryBuilder('watering')
      .leftJoinAndSelect('watering.plant', 'plant');

    if (plantId) {
      baseQuery = baseQuery.where('plant.id = :plantId', {
        plantId,
      });
    }

    try {
      return await baseQuery.orderBy('date', 'DESC').getMany();
    } catch (error) {
      throw new HttpException(
        `Error getting all the waterings from the plant ${plantId}.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    const watering = await this.wateringRepository
      .createQueryBuilder('watering')
      .where('id = :id', { id })
      .getOne();
    if (!watering) {
      throw new HttpException(
        `Watering with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return watering;
  }

  async remove(id: number) {
    try {
      const removedWatering = await this.wateringRepository
        .createQueryBuilder()
        .delete()
        .from(Watering)
        .where('id = :id', { id })
        .execute();
      if (removedWatering.affected === 0) {
        throw new HttpException(
          `Watering with id ${id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return removedWatering.affected === 1;
    } catch (error) {
      throw new HttpException(
        `Error removing the watering with id ${id}.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
