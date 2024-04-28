import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PlantService } from '../../plant/service/plant.service';
import { User } from '../../user/entities/user.entity';
import { CreateTransplantingDto } from '../dto/create-transplanting.dto';
import { FindAllTransplantingsParams } from '../dto/find-all-transplantings.dto';
import { TransplantingRepository } from '../repository/transplanting.repository';

@Injectable()
export class TransplantingService {
  constructor(
    private transplantingRepository: TransplantingRepository,
    private plantService: PlantService,
  ) {}

  async create(createTransplantingDto: CreateTransplantingDto) {
    const { plantId, ...transplantingData } = createTransplantingDto;
    const relations = [{ plant: plantId }];

    try {
      const newTransplantingId = await this.transplantingRepository.insert(
        transplantingData,
        relations,
      );
      if (!newTransplantingId) {
        throw new HttpException(
          'Error creating the transplanting.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return newTransplantingId;
    } catch (error) {
      throw new HttpException(
        'Error creating the transplanting.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    requestUser: Partial<User>,
    filters: FindAllTransplantingsParams,
  ) {
    //#region User access control
    const isRequestUserAdmin = requestUser.role === 'admin';
    if (!isRequestUserAdmin) {
      const isFiltersValid = await this.validateFilters(
        filters,
        requestUser.id,
      );
      if (!isFiltersValid) {
        throw new HttpException('Invalid filters.', HttpStatus.BAD_REQUEST);
      }
    }

    try {
      return await this.transplantingRepository.find(filters);
    } catch (error) {
      throw new HttpException(
        'Error while fetching transplanting.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      return await this.transplantingRepository
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
      const removedTransplanting = await this.transplantingRepository
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

  /**
   *
   * Only for non-admin users.
   *
   * plantId is mandatory and needs to be the id of a plant that belongs to the user.
   */
  private async validateFilters(
    filters: FindAllTransplantingsParams,
    requestUserId: number,
  ) {
    const { plantId } = filters;

    if (!plantId) {
      return false;
    }

    return await this.plantService.isPlantFromUser(plantId, requestUserId);
  }
}
