import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SpotService } from '../../spot/service/spot.service';
import { Role, User } from '../../user/entities/user.entity';
import { CreatePlantDto } from '../dto/create-plant.dto';
import { FindAllPlantsParams } from '../dto/find-all-plants.dto';
import { UpdatePlantDto } from '../dto/update-plant.dto';
import { PlantRepository } from '../repository/plant.repository';

@Injectable()
export class PlantService {
  constructor(
    private plantRepository: PlantRepository,
    private spotService: SpotService,
  ) {}

  async create(userId: number, plantData: CreatePlantDto): Promise<number> {
    const isPlantNameRegistered =
      await this.plantRepository.findByNameAndUserId(plantData.name, userId);
    if (isPlantNameRegistered) {
      throw new HttpException(
        'Plant name is already in use.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { spotId, photoId, ...plantDataWithoutSpotId } = plantData;
    const relations = [{ spot: spotId }, { user: userId }, { photos: photoId }];
    try {
      const newPlantId = await this.plantRepository.insert(
        plantDataWithoutSpotId,
        relations,
      );
      if (!newPlantId) {
        throw new HttpException(
          'Error creating the plant.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return newPlantId;
    } catch (error) {
      throw new HttpException(
        'Error creating the plant.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    requestUser: Partial<User>,
    id: number,
    plantData: UpdatePlantDto,
  ) {
    //#region Validate user access to plant
    const validateUserAccess = await this.validateUserAccessToPlant(
      id,
      requestUser,
    );
    if (!validateUserAccess) {
      throw new HttpException(
        'You can only update your own plant.',
        HttpStatus.FORBIDDEN,
      );
    }
    //#endregion
    const { spotId, ...plantDataWithoutSpotId } = plantData;

    const updatedPlant = await this.plantRepository.updateById(
      id,
      plantDataWithoutSpotId,
      spotId,
    );
    if (!updatedPlant) {
      throw new HttpException(
        `Error while updating the plant.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return id;
  }

  async findAll(requestUser: Partial<User>, filters: FindAllPlantsParams) {
    //#region User access control
    const isRequestUserAdmin = requestUser.role === Role.Admin;
    if (!isRequestUserAdmin) {
      const isFiltersValid = await this.validateFilters(
        filters,
        requestUser.id,
      );
      if (!isFiltersValid) {
        throw new HttpException('Wrong filters.', HttpStatus.BAD_REQUEST);
      }
    }
    //#endregion

    //#region Query execution
    try {
      return await this.plantRepository.find(filters);
    } catch (error) {
      throw new HttpException(
        'Error getting all plants.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    //#endregion
  }

  async findOne(requestUser: Partial<User>, id: number) {
    const validateUserAccess = await this.validateUserAccessToPlant(
      id,
      requestUser,
    );
    if (!validateUserAccess) {
      throw new HttpException(
        'You can only see your own plant.',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      return await this.plantRepository.findById(id);
    } catch (error) {
      throw new HttpException(
        `Plant with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async remove(requestUser: Partial<User>, id: number) {
    const validateUserAccess = await this.validateUserAccessToPlant(
      id,
      requestUser,
    );
    if (!validateUserAccess) {
      throw new HttpException(
        'You can only delete your own plant.',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const removedPlant = await this.plantRepository.removeById(id);
      if (!removedPlant) {
        throw new HttpException(
          `Plant with id ${id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return removedPlant;
    } catch (error) {
      throw new HttpException(
        `Plant with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private async validateUserAccessToPlant(id: number, user: Partial<User>) {
    const isAdminUser = user.role === Role.Admin;
    if (isAdminUser) return true;

    return await this.isPlantFromUser(id, user.id);
  }

  private async isPlantFromUser(plantId: number, userId: number) {
    const plant = await this.plantRepository.findByIdAndUserId(plantId, userId);

    return !!plant;
  }

  /**
   * Only for non-admin users.
   *
   * userId is mandatory and needs to be the id of the user making the request.
   *
   * spotId is optional, if sent, the user needs to have access to it.
   */
  private async validateFilters(
    filters: FindAllPlantsParams,
    requestUserId: number,
  ) {
    const { spotId, userId } = filters;

    if (userId !== requestUserId) return false;

    if (spotId) {
      return await this.spotService.isSpotFromUser(spotId, requestUserId);
    }

    return true;
  }
}
