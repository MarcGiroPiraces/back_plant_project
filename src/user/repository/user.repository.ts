import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private initiateQueryBuilder() {
    return this.userRepository.createQueryBuilder('user');
  }

  async insert(userData: CreateUserDto) {
    const { identifiers } = await this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values(userData)
      .execute();

    return identifiers[0].id as number;
  }

  async updateById(id: number, userData: Partial<User>) {
    const updatedUser = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set(userData)
      .where('id = :id', { id })
      .execute();

    return updatedUser.affected === 1;
  }

  async findOneByEmail(email: string) {
    return await this.initiateQueryBuilder()
      .where('email = :email', { email })
      .getOne();
  }

  async findOneById(id: number) {
    return await this.initiateQueryBuilder()
      .where('id = :id', { id })
      .leftJoinAndSelect('user.plants', 'plants')
      .leftJoinAndSelect('user.spots', 'spot')
      .getOne();
  }

  async findAll() {
    return await this.initiateQueryBuilder()
      .leftJoinAndSelect('user.plants', 'plants')
      .leftJoinAndSelect('user.spots', 'spot')
      .getMany();
  }

  async removeById(id: number) {
    const deletedUser = await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id })
      .execute();

    return deletedUser.affected === 1;
  }
}
