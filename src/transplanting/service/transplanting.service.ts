import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransplantingDto } from '../dto/create-transplanting.dto';
import { FindAllTransplantingsDto } from '../dto/find-all-transplantings.dto';
import { Transplanting } from '../entities/transplanting.entity';

@Injectable()
export class TransplantingService {
  constructor(
    @InjectRepository(Transplanting)
    private repository: Repository<Transplanting>,
  ) {}
  async create(createTransplantingDto: CreateTransplantingDto) {
    createTransplantingDto.date = new Date(createTransplantingDto.date);
    const { identifiers } = await this.repository
      .createQueryBuilder()
      .insert()
      .into(Transplanting)
      .values(createTransplantingDto)
      .execute();

    const newTransplantingId = identifiers[0].id as number;
    await this.repository
      .createQueryBuilder('transplanting')
      .relation(Transplanting, 'plant')
      .of(newTransplantingId)
      .set(createTransplantingDto.plantId);

    return newTransplantingId;
  }

  async findAll(filters: FindAllTransplantingsDto) {
    const plantId = filters.plantId ? filters.plantId : null;

    try {
      const baseQuery = this.repository
        .createQueryBuilder('transplanting')
        .innerJoinAndSelect('transplanting.plant', 'plant');

      if (plantId) {
        baseQuery.where('plant.id = :plantId', { plantId });
      }

      return await baseQuery.orderBy('transplanting.date', 'DESC').getMany();
    } catch (error) {
      throw new HttpException(
        'Error while fetching transplanting.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      return await this.repository
        .createQueryBuilder('transplanting')
        .leftJoinAndSelect('transplanting.plant', 'plant')
        .where('transplanting.id = :id', { id })
        .getOne();
    } catch (error) {
      throw new HttpException(
        'Error while fetching the transplanting.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const removedTransplanting = await this.repository
        .createQueryBuilder()
        .delete()
        .where('id = :id', { id })
        .execute();

      if (removedTransplanting.affected === 0) {
        throw new HttpException(
          'Transplanting not found.',
          HttpStatus.NOT_FOUND,
        );
      }

      return removedTransplanting.affected === 1;
    } catch (error) {
      throw new HttpException(
        'Error while removing the transplanting.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
