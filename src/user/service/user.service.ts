import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Role, User } from '../entities/user.entity';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserService {
  constructor(@Inject(UserRepository) private userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto) {
    const isEmailRegistered = await this.userRepository.findOneByEmail(
      createUserDto.email,
    );
    if (isEmailRegistered) {
      throw new HttpException('Email already in use.', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.userRepository.insert(createUserDto);
    } catch (error) {
      throw new HttpException(
        'Error creating the user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: number,
    requestUser: Partial<User>,
    updateUserDto: UpdateUserDto,
  ) {
    const validateUserAccess = this.validateRoleAndAccess(id, requestUser);
    if (!validateUserAccess) {
      throw new HttpException(
        'You can only update your own user.',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new HttpException(
        `User with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const updatedUser = await this.userRepository.updateById(
        id,
        updateUserDto,
      );
      if (!updatedUser) {
        throw new HttpException(
          'Error updating the user.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return id;
    } catch (error) {
      throw new HttpException(
        'Error updating the user.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      throw new HttpException(
        'Error getting all users.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number, requestUser: Partial<User>) {
    const validateUserAccess = this.validateRoleAndAccess(id, requestUser);
    if (!validateUserAccess) {
      throw new HttpException(
        'You can only get your own user.',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new HttpException(
        `User with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async remove(id: number, requestUser: Partial<User>) {
    const validateUserAccess = this.validateRoleAndAccess(id, requestUser);
    if (!validateUserAccess) {
      throw new HttpException(
        'You can only delete your own user.',
        HttpStatus.FORBIDDEN,
      );
    }

    const deletedUser = await this.userRepository.removeById(id);
    if (!deletedUser) {
      throw new HttpException(`Error deleting the user.`, HttpStatus.NOT_FOUND);
    }

    return deletedUser;
  }

  private validateRoleAndAccess(userId: number, user: Partial<User>) {
    const isAdmin = user.role === Role.Admin;
    const isOwner = userId === user.id;

    return isAdmin || isOwner;
  }
}
