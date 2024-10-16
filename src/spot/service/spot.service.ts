import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Role, User } from '../../user/entities/user.entity';
import { CreateSpotDto } from '../dto/create-spot.dto';
import { FindAllSpotsParams } from '../dto/find-all-spots.dto';
import { SpotRepository } from '../repository/spot.repository';

@Injectable()
export class SpotService {
  constructor(private readonly spotRepository: SpotRepository) {}

  async createOne(
    requestUser: Partial<User>,
    createSpotDto: CreateSpotDto,
  ): Promise<number> {
    const requestUserId = requestUser.id;
    const isSpotRegistred = await this.spotRepository.findByRoomUserAndPlace(
      createSpotDto.room,
      requestUserId,
      createSpotDto.place,
    );
    if (isSpotRegistred) {
      throw new HttpException(
        'Spot name is already in use.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const createdSpotId = await this.spotRepository.createOne(
      createSpotDto,
      requestUserId,
    );
    if (!createdSpotId) {
      throw new HttpException(
        'Error creating the spot.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return createdSpotId;
  }

  async findAll(requestUser: Partial<User>, filters: FindAllSpotsParams) {
    //#region User access control
    const isRequestUserAdmin = requestUser.role === Role.Admin;
    if (!isRequestUserAdmin) {
      const isFiltersValid = this.validateFilters(filters, requestUser.id);
      if (!isFiltersValid) {
        throw new HttpException('Wrong filters.', HttpStatus.BAD_REQUEST);
      }
    }
    //#endregion

    //#region Query execution
    try {
      return await this.spotRepository.findOne(filters);
    } catch (error) {
      throw new HttpException(
        'Error getting all spots.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    //#endregion
  }

  async findOne(requestUser: Partial<User>, id: number) {
    //#region User access control
    const validateUserAccess = await this.validateUserAccessToSpot(
      id,
      requestUser,
    );
    if (!validateUserAccess) {
      throw new HttpException(
        'You can only see your own spots.',
        HttpStatus.BAD_REQUEST,
      );
    }
    //#endregion

    const createdSpot = await this.spotRepository.findOneById(id);
    if (!createdSpot) {
      throw new HttpException(
        `Spot with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return createdSpot;
  }

  async removeOne(requestUser: Partial<User>, id: number) {
    //#region User access control
    const validateUserAccess = await this.validateUserAccessToSpot(
      id,
      requestUser,
    );
    if (!validateUserAccess) {
      throw new HttpException(
        'You can only remove your own spots.',
        HttpStatus.BAD_REQUEST,
      );
    }
    //#endregion

    const removedSpot = await this.spotRepository.removeOne(id);
    if (!removedSpot) {
      throw new HttpException(
        `Spot with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return removedSpot;
  }

  async isSpotFromUser(spotId: number, userId: number) {
    const spot = await this.spotRepository.findOneById(spotId);
    const spotUserId = spot ? spot.user.id : null;

    return spotUserId === userId;
  }

  private validateFilters(filters: FindAllSpotsParams, requestUserId: number) {
    const { userId } = filters;

    return userId === requestUserId;
  }

  /**
   * If the user is an admin, he can access any spot.
   *
   * If the user is not an admin, he can only access his own spots.
   */
  private async validateUserAccessToSpot(
    spotId: number,
    requestUser: Partial<User>,
  ) {
    const isAdminUser = requestUser.role === Role.Admin;
    if (isAdminUser) return true;

    return await this.isSpotFromUser(spotId, requestUser.id);
  }
}
