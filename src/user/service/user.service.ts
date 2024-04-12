import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Role, User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const isEmailRegistered = await this.findOneByEmailRepo(
      createUserDto.email,
    );
    if (isEmailRegistered) {
      throw new HttpException('Email already in use.', HttpStatus.BAD_REQUEST);
    }
    try {
      const { identifiers } = await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(createUserDto)
        .execute();

      return identifiers[0].id as number;
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

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('id = :id', { id })
      .getOne();
    if (!user) {
      throw new HttpException(
        `User with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(updateUserDto)
        .where('id = :id', { id })
        .execute();

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
      return await this.userRepository.createQueryBuilder('user').getMany();
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

    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
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

    try {
      const deletedUser = await this.userRepository
        .createQueryBuilder()
        .delete()
        .from(User)
        .where('id = :id', { id })
        .execute();

      return deletedUser.affected === 1;
    } catch (error) {
      throw new HttpException(
        `User with ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findOneByEmailRepo(email: string) {
    const user = (await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne()) as User;

    return user || null;
  }

  private validateRoleAndAccess(userId: number, user: Partial<User>) {
    const isAdmin = user.role === Role.Admin;
    const isOwner = userId === user.id;

    return isAdmin || isOwner;
  }
}
