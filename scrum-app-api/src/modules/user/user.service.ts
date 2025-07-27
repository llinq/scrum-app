import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(userEntity: UserEntity): Promise<UserEntity> {
    return this.userRepository.create(userEntity);
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findByEmail(email);
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    return this.userRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.userRepository.delete(id);
  }
} 