import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

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

  async findAll() {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.plants', 'plant')
        .leftJoinAndSelect('plant.spot', 'spot')
        .getMany();
    } catch (error) {
      throw new HttpException(
        'Error getting all users.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.plants', 'plant')
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

  async findOneByEmailRepo(email: string) {
    const user = (await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne()) as User;

    return user || null;
  }

  async update(id: number, userId: number, updateUserDto: UpdateUserDto) {
    if (id !== userId) {
      throw new HttpException(
        'You can only update your own user.',
        HttpStatus.FORBIDDEN,
      );
    }

    const updatedUser = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(updateUserDto)
      .where('id = :id', { id })
      .execute();

    if (updatedUser.affected === 0) {
      throw new HttpException(
        `User with ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return updatedUser.affected === 1;
  }

  async remove(id: number, userId: number) {
    if (id !== userId) {
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
}
