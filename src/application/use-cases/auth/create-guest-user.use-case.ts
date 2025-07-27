import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../interfaces/user.repository.interface';
import { UserEntity } from '../../../domain/entities/user.entity';

export interface CreateGuestUserRequest {
  name: string;
}

export interface CreateGuestUserResponse {
  user: UserEntity;
  token: string;
}

@Injectable()
export class CreateGuestUserUseCase {
  constructor(@Inject('IUserRepository') private readonly userRepository: IUserRepository) { }

  async execute(request: CreateGuestUserRequest): Promise<CreateGuestUserResponse> {
    const user = UserEntity.createGuest(request.name);
    const savedUser = await this.userRepository.create(user);

    // Aqui você implementaria a geração do token JWT
    const token = 'generated-jwt-token';

    return {
      user: savedUser,
      token,
    };
  }
} 