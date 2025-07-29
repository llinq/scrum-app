import { Injectable } from "@nestjs/common";
import { IUser, UserEntity } from "../user/user.entity";
import { UserRepository } from "../user/user.repository";
import { JwtService } from "@nestjs/jwt";

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

export interface GoogleUserData {
  googleId: string;
  email: string;
  name: string;
  avatar_url: string;
}

export interface GoogleAuthResponse {
  user: UserEntity;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async createGuest(
    request: CreateGuestUserRequest
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

  async findOrCreateGoogleUser(
    googleUserData: GoogleUserData
  ): Promise<IUser> {
    // Verificar se o usuário já existe pelo email
    let existingUser = await this.userRepository.findByEmail(
      googleUserData.email
    );

    if (existingUser) {
      // Atualizar dados do usuário se necessário
      if (!existingUser.avatar_url && googleUserData.avatar_url) {
        existingUser = await this.userRepository.update(existingUser.id, {
          avatar_url: googleUserData.avatar_url,
          last_login: new Date(),
        });
      } else {
        existingUser = await this.userRepository.update(existingUser.id, {
          last_login: new Date(),
        });
      }
    } else {
      // Criar novo usuário
      const newUser = UserEntity.createUser(
        googleUserData.email,
        googleUserData.name
      );
      // Atualizar com dados do Google
      const userWithGoogleData = new UserEntity(
        newUser.id,
        newUser.email,
        newUser.name,
        googleUserData.avatar_url,
        false,
        null,
        newUser.created_at,
        newUser.updated_at,
        new Date() // last_login
      );
      existingUser = await this.userRepository.create(userWithGoogleData);
    }

    return existingUser
  }
}
