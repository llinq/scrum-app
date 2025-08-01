import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @ApiProperty({
    description: 'Mensagem de resposta da operação',
    example: 'Operation completed successfully',
  })
  message: string;
}
