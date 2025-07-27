import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateGuestUserUseCase } from '../../application/use-cases/auth/create-guest-user.use-case';
import { CreateGuestUserDto } from '../../application/dtos/create-guest-user.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly createGuestUserUseCase: CreateGuestUserUseCase,
  ) {}

  @Post('guest')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar usuário convidado' })
  @ApiResponse({ status: 201, description: 'Usuário convidado criado com sucesso' })
  async createGuest(@Body() createGuestUserDto: CreateGuestUserDto) {
    return this.createGuestUserUseCase.execute(createGuestUserDto);
  }
} 