import { Injectable } from '@nestjs/common';
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
    const isEmailRegistered = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    if (isEmailRegistered) {
      throw new Error('Email is already registered');
    }

    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userRepository.update({ id }, updateUserDto);
    if (updatedUser.affected === 0) {
      throw new Error('User not found');
    }

    return updatedUser.affected === 1;
  }

  async remove(id: number) {
    const deletedUser = await this.userRepository.delete({ id });
    if (deletedUser.affected === 0) {
      throw new Error('User not found');
    }

    return deletedUser.affected === 1;
  }
}
