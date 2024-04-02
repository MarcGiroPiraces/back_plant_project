import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlant } from '../dto/create-plant.dto';
import { FindAllPlants } from '../dto/find-all-plants.dto';
import { UpdatePlant } from '../dto/update-plant.dto';
import { Plant } from '../entities/plant.entity';

@Injectable()
export class PlantService {
  constructor(
    @InjectRepository(Plant) private plantRepository: Repository<Plant>,
  ) {}
  async create(plantData: CreatePlant): Promise<number> {
    const isPlantNameRegistered = await this.plantRepository
      .createQueryBuilder('plant')
      .where('plant.name = :name', { name: plantData.name })
      .andWhere('plant.user = :userId', { userId: plantData.userId })
      .getOne();
    if (isPlantNameRegistered) {
      throw new HttpException(
        'Plant name is already in use.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { userId, spotId, ...newPlantData } = { ...plantData };
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

  async update(plantData: UpdatePlant) {
    const plant = await this.plantRepository
      .createQueryBuilder('plant')
      .where('plant.id = :id', { id: plantData.id })
      .andWhere('plant.user = :userId', { userId: plantData.userId })
      .getOne();
    if (!plant) {
      throw new HttpException(
        `Plant with id ${plantData.id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    const updatedPlant = Object.assign(plant, plantData);

    try {
      await this.plantRepository
        .createQueryBuilder()
        .update(Plant)
        .set({ ...updatedPlant })
        .where('id = :id', { id: updatedPlant.id })
        .execute();

      return updatedPlant.id;
    } catch (error) {
      throw new HttpException(
        'Error updating the plant.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(filters: FindAllPlants) {
    const userId = filters.userId ? filters.userId : null;
    const spotId = filters.spotId ? filters.spotId : null;

    try {
      let query = this.plantRepository
        .createQueryBuilder('plant')
        .leftJoinAndSelect('plant.user', 'user')
        .leftJoinAndSelect('plant.waterings', 'waterings')
        .leftJoinAndSelect('plant.transplantings', 'transplantings')
        .leftJoinAndSelect('plant.spot', 'spot');
      if (userId) {
        query = query.where('plant.userId = :userId', { userId });
      }
      if (spotId) {
        query = query.where('plant.spotId = :spotId', { spotId });
      }

      return await query.getMany();
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
