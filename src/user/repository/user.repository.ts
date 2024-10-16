import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private initiateQueryBuilder() {
    return this.userRepository.createQueryBuilder('user');
  }

  async createOne(userData: CreateUserDto) {
    const { identifiers } = await this.initiateQueryBuilder()
      .insert()
      .into(User)
      .values(userData)
      .execute();

    return identifiers[0].id as number;
  }

  async updateOneById(id: number, userData: Partial<User>) {
    const updatedUser = await this.initiateQueryBuilder()
      .update(User)
      .set(userData)
      .where('id = :id', { id })
      .execute();

    return updatedUser.affected === 1;
  }

  async findOneByEmail(email: string) {
    return await this.initiateQueryBuilder()
      .addSelect('user.password')
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

  async removeOneById(id: number) {
    const deletedUser = await this.initiateQueryBuilder()
      .delete()
      .from(User)
      .where('id = :id', { id })
      .execute();

    return deletedUser.affected === 1;
  }
}
