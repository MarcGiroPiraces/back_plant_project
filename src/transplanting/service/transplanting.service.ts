import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PlantService } from '../../plant/service/plant.service';
import { Role, User } from '../../user/entities/user.entity';
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
    const isAccessAndFilters = await this.validateAccessAndFilters(
      filters,
      requestUser,
    );
    if (!isAccessAndFilters)
      throw new HttpException(
        'Invalid filters or access.',
        HttpStatus.BAD_REQUEST,
      );

    try {
      return await this.transplantingRepository.find(filters);
    } catch (error) {
      throw new HttpException(
        'Error while fetching transplanting.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(requestUser: Partial<User>, id: number) {
    //#region User access control
    const isRequestUserAdmin = requestUser.role === Role.Admin;
    if (!isRequestUserAdmin) {
      const isTransplantingFromUser =
        await this.transplantingRepository.isTransplantingFromUser(
          id,
          requestUser.id,
        );
      if (!isTransplantingFromUser) {
        throw new HttpException(
          'You can only see your own transplantings.',
          HttpStatus.FORBIDDEN,
        );
      }
    }
    //#endregion

    try {
      return await this.transplantingRepository.findOne(id);
    } catch (error) {
      throw new HttpException(
        'Error while fetching the transplanting.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(requestUser: Partial<User>, id: number) {
    //#region User access control
    const isTransplantingFromUser = await this.isTransplantingFromUser(
      id,
      requestUser,
    );
    if (!isTransplantingFromUser) {
      throw new HttpException(
        'You can only remove your own transplantings.',
        HttpStatus.FORBIDDEN,
      );
    }
    //#endregion

    try {
      const removedTransplanting =
        await this.transplantingRepository.removeById(id);

      if (removedTransplanting) {
        throw new HttpException(
          'Transplanting not found.',
          HttpStatus.NOT_FOUND,
        );
      }

      return removedTransplanting;
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
  private async validateAccessAndFilters(
    filters: FindAllTransplantingsParams,
    requestUser: Partial<User>,
  ) {
    const isRequestUserAdmin = requestUser.role === Role.Admin;
    if (isRequestUserAdmin) return true;

    const { plantId } = filters;
    if (!plantId) return false;

    return await this.plantService.isPlantFromUser(plantId, requestUser.id);
  }

  private async isTransplantingFromUser(
    transplantingId: number,
    requestUser: Partial<User>,
  ) {
    const userId = requestUser.id;
    //#region User access control
    const isRequestUserAdmin = requestUser.role === Role.Admin;
    if (isRequestUserAdmin) return true;
    //#endregion

    return await this.transplantingRepository.isTransplantingFromUser(
      transplantingId,
      userId,
    );
  }
}
