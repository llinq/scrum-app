import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(message: string = 'Usuário não encontrado') {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class InvalidInviteCodeException extends HttpException {
  constructor(message: string = 'Código de convite inválido') {
    super(message, HttpStatus.BAD_REQUEST);
  }
} 