import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';

export interface CreateGuestUserRequest {
  name: string;
}

export interface CreateGuestUserResponse {
  user: UserEntity;
  token: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
}

export interface CreateUserResponse {
  user: UserEntity;
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async createGuest(
    request: CreateGuestUserRequest,
  ): Promise<CreateGuestUserResponse> {
    const user = UserEntity.createGuest(request.name);
    const savedUser = await this.userRepository.create(user);

    const token = await this.generateToken(savedUser.id);

    return {
      user: savedUser,
      token,
    };
  }

  async createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
    const user = UserEntity.createUser(request.email, request.name);
    const savedUser = await this.userRepository.create(user);

    const token = await this.generateToken(savedUser.id);

    return {
      user: savedUser,
      token,
    };
  }

  async generateToken(userId: string): Promise<string> {
    return await this.jwtService.signAsync({ sub: userId });
  }

  async validateToken(token: string): Promise<{ sub: string }> {
    return await this.jwtService.verifyAsync(token);
  }
}
