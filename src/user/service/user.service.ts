import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto, createUserSchema } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      createUserSchema.parse(createUserDto);
    } catch (error) {
      throw new HttpException('Invalid data provided.', HttpStatus.BAD_REQUEST);
    }

    const isEmailRegistered = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: createUserDto.email })
      .getOne();

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

  async findOneByEmail(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
    if (!user) {
      throw new HttpException(
        `User with email ${email} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
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

  async remove(id: number) {
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
