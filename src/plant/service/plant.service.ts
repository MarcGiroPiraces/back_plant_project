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
    private readonly plantRepository: PlantRepository,
    private readonly spotService: SpotService,
  ) {}

  async createOne(
    requestUser: Partial<User>,
    createPlantDto: CreatePlantDto,
  ): Promise<number> {
    const userId = requestUser.id;
    const isPlantNameRegistered =
      await this.plantRepository.findOneByNameAndUserId(
        createPlantDto.name,
        userId,
      );
    if (isPlantNameRegistered) {
      throw new HttpException(
        'Plant name is already in use.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { spotId, photoId, ...plantDataWithoutSpotId } = createPlantDto;
    const isSpotFromUser = await this.spotService.isSpotFromUser(
      spotId,
      userId,
    );
    if (!isSpotFromUser) {
      throw new HttpException(
        'You can only create a plant in your own spot.',
        HttpStatus.FORBIDDEN,
      );
    }
    const relations = [{ spot: spotId }, { user: userId }, { photos: photoId }];
    try {
      const createdPlantId = await this.plantRepository.createOne(
        plantDataWithoutSpotId,
        new Date(),
        relations,
      );
      if (!createdPlantId) {
        throw new HttpException(
          'Error creating the plant.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return createdPlantId;
    } catch (error) {
      throw new HttpException(
        'Error creating the plant.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOne(
    requestUser: Partial<User>,
    id: number,
    updatePlantDto: UpdatePlantDto,
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
    const { spotId, ...plantDataWithoutSpotId } = updatePlantDto;

    const updatedPlant = await this.plantRepository.updateOne(
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
    const isFiltersValid = await this.validateFilters(requestUser, filters);
    if (!isFiltersValid) {
      throw new HttpException('Invalid filters.', HttpStatus.BAD_REQUEST);
    }
    //#endregion

    //#region Query execution
    try {
      return await this.plantRepository.findOne(filters);
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
      return await this.plantRepository.findOneById(id);
    } catch (error) {
      throw new HttpException(
        `Plant with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async removeOne(requestUser: Partial<User>, id: number) {
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
      const removedPlant = await this.plantRepository.removeOne(id);
      if (!removedPlant) {
        throw new HttpException(
          `Plant with id ${id} not found.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return removedPlant;
    } catch (error) {
      throw new HttpException(
        `Error while deleting the plant with id ${id}.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async validateUserAccessToPlant(id: number, user: Partial<User>) {
    const isAdminUser = user.role === Role.Admin;
    if (isAdminUser) return true;

    return await this.isPlantFromUser(id, user.id);
  }

  async isPlantFromUser(plantId: number, userId: number) {
    const plant = await this.plantRepository.findOneByIdAndUserId(
      plantId,
      userId,
    );

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
    requestUser: Partial<User>,
    filters: FindAllPlantsParams,
  ) {
    const isRequestUserAdmin = requestUser.role === Role.Admin;
    const { spotId, userId } = filters;

    if (!isRequestUserAdmin) {
      const userIdCheck = userId === requestUser.id;
      const spotIdCheck = spotId
        ? await this.spotService.isSpotFromUser(spotId, requestUser.id)
        : true;

      if (!userIdCheck || !spotIdCheck) return false;
    }

    return true;
  }
}
