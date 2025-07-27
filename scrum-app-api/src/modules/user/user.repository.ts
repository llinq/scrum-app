import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { User } from '../../shared/database/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(userEntity: UserEntity): Promise<UserEntity> {
    const user = new User();
    user.email = userEntity.email;
    user.name = userEntity.name;
    user.avatar_url = userEntity.avatar_url;
    user.is_guest = userEntity.is_guest;
    user.guest_name = userEntity.guest_name;

    const savedUser = await this.userRepo.save(user);
    return this.toDomain(savedUser);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity> {
    const updateData: Partial<User> = {};
    
    if (data.email !== undefined) updateData.email = data.email;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.avatar_url !== undefined) updateData.avatar_url = data.avatar_url;
    if (data.is_guest !== undefined) updateData.is_guest = data.is_guest;
    if (data.guest_name !== undefined) updateData.guest_name = data.guest_name;
    if (data.last_login !== null) updateData.last_login = data.last_login;

    await this.userRepo.update(id, updateData);
    const user = await this.userRepo.findOne({ where: { id } });
    return this.toDomain(user!);
  }

  async delete(id: string): Promise<void> {
    await this.userRepo.delete(id);
  }

  private toDomain(user: User): UserEntity {
    return new UserEntity(
      user.id,
      user.email,
      user.name,
      user.avatar_url,
      user.is_guest,
      user.guest_name,
      user.created_at,
      user.updated_at,
      user.last_login,
    );
  }
} 