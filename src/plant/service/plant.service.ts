import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlantDto } from '../dto/create-plant.dto';
import { Plant } from '../entities/plant.entity';

@Injectable()
export class PlantService {
  constructor(
    @InjectRepository(Plant) private plantRepository: Repository<Plant>,
  ) {}
  async create(
    createPlantDto: CreatePlantDto & { userId: number },
  ): Promise<number> {
    const isPlantNameRegistered = await this.plantRepository
      .createQueryBuilder('plant')
      .where('plant.name = :name', { name: createPlantDto.name })
      .andWhere('plant.user = :userId', { userId: createPlantDto.userId })
      .getOne();
    if (isPlantNameRegistered) {
      throw new HttpException(
        'Plant name is already in use.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { userId, spotId, ...newPlantData } = { ...createPlantDto };
    try {
      const { identifiers } = await this.plantRepository
        .createQueryBuilder()
        .insert()
        .into(Plant)
        .values({ ...newPlantData, createdAt: new Date() })
        .execute();
      const newPlantId = identifiers[0].id as number;
      await this.plantRepository
        .createQueryBuilder('plant')
        .relation(Plant, 'user')
        .of(newPlantId)
        .set(userId);
      await this.plantRepository
        .createQueryBuilder('plant')
        .relation(Plant, 'spot')
        .of(newPlantId)
        .set(spotId);

      return newPlantId;
    } catch (error) {
      throw new HttpException(
        'Error creating the plant.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(userId: number) {
    try {
      const plantsQuery = this.plantRepository
        .createQueryBuilder('plant')
        .leftJoinAndSelect('plant.user', 'user')
        .leftJoinAndSelect('plant.waterings', 'waterings')
        .leftJoinAndSelect('plant.transplantings', 'transplantings')
        .leftJoinAndSelect('plant.spot', 'spot');
      if (userId) {
        return await plantsQuery
          .where('plant.userId = :userId', { userId })
          .getMany();
      }

      return await plantsQuery.getMany();
    } catch (error) {
      throw new HttpException(
        'Error getting all plants.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      return await this.plantRepository
        .createQueryBuilder('plant')
        .leftJoinAndSelect('plant.user', 'user')
        .leftJoinAndSelect('plant.waterings', 'waterings')
        .leftJoinAndSelect('plant.transplantings', 'transplantings')
        .where('plant.id = :id', { id })
        .getOne();
    } catch (error) {
      throw new HttpException(
        `Plant with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async remove(id: number) {
    try {
      const removedPlant = await this.plantRepository
        .createQueryBuilder()
        .delete()
        .from(Plant)
        .where('id = :id', { id })
        .execute();
      if (removedPlant.affected === 0) {
        throw new HttpException(
          `Plant with id ${id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return removedPlant.affected === 1;
    } catch (error) {
      throw new HttpException(
        `Plant with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
