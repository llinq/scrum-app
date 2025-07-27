import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '../controllers/auth.controller';
import { CreateGuestUserUseCase } from '../../application/use-cases/auth/create-guest-user.use-case';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { User } from '../../infrastructure/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    CreateGuestUserUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
})
export class AuthModule {} 