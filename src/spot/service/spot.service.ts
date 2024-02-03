import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpotDto, CreateSpotSchema } from '../dto/create-spot.dto';
import { UpdateSpotDto } from '../dto/update-spot.dto';
import { Spot } from '../entities/spot.entity';

@Injectable()
export class SpotService {
  constructor(
    @InjectRepository(Spot) private spotRepository: Repository<Spot>,
  ) {}
  async create(createSpotDto: CreateSpotDto) {
    try {
      CreateSpotSchema.parse(createSpotDto);
    } catch (error) {
      throw new HttpException('Invalid data provided.', HttpStatus.BAD_REQUEST);
    }

    const isSpotRegistred = await this.spotRepository
      .createQueryBuilder('spot')
      .where('spot.room = :room', { room: createSpotDto.room })
      .andWhere('spot.user = :userId', { userId: createSpotDto.userId })
      .andWhere('spot.place = :place', { place: createSpotDto.place })
      .getOne();
    if (isSpotRegistred) {
      throw new HttpException(
        'Spot name is already in use.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { userId, ...newSpotData } = { ...createSpotDto };
    try {
      const { identifiers } = await this.spotRepository
        .createQueryBuilder()
        .insert()
        .into(Spot)
        .values({ ...newSpotData })
        .execute();
      const newSpotId = identifiers[0].id;
      await this.spotRepository
        .createQueryBuilder('spot')
        .relation(Spot, 'user')
        .of(newSpotId)
        .set(userId);

      return newSpotId;
    } catch (error) {
      throw new HttpException(
        'Error creating the spot.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll(userId: number) {
    try {
      const baseQuery = this.spotRepository
        .createQueryBuilder('spot')
        .leftJoinAndSelect('spot.user', 'user')
        .leftJoinAndSelect('spot.plants', 'plants');

      if (userId) {
        return baseQuery.where('spot.user = :userId', { userId }).getMany();
      }
      return baseQuery.getMany();
    } catch (error) {
      throw new HttpException(
        'Error getting all spots.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findOne(id: number) {
    try {
      return this.spotRepository
        .createQueryBuilder('spot')
        .leftJoinAndSelect('spot.user', 'user')
        .leftJoinAndSelect('spot.plants', 'plants')
        .where('spot.id = :id', { id })
        .getOne();
    } catch (error) {
      throw new HttpException(
        `Spot with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  update(id: number, updateSpotDto: UpdateSpotDto) {
    return `This action updates a #${id} spot`;
  }

  async remove(id: number) {
    try {
      const removedSpot = await this.spotRepository
        .createQueryBuilder()
        .delete()
        .from(Spot)
        .where('id = :id', { id })
        .execute();
      if (removedSpot.affected === 0) {
        throw new HttpException(
          `Spot with id ${id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }
      return removedSpot.affected === 1;
    } catch (error) {
      throw new HttpException(
        `Spot with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
