import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { RetroColumnService } from './retro-column.service';
import { CreateRetroColumnDto } from './dto/create-retro-column.dto';
import { UpdateRetroColumnDto } from './dto/update-retro-column.dto';
import { RetroColumnResponseDto } from './dto/retro-column-response.dto';
import { MessageResponseDto } from '../../shared/dto/message-response.dto';

@ApiTags('Retro Columns')
@ApiBearerAuth()
@Controller('retro-columns')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class RetroColumnController {
  constructor(private readonly columnService: RetroColumnService) {}

  @Post('board/:boardId')
  @ApiOperation({ summary: 'Criar nova coluna em um board' })
  @ApiParam({ name: 'boardId', description: 'ID do board' })
  @ApiResponse({ status: 201, description: 'Coluna criada com sucesso.', type: RetroColumnResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 403, description: 'Acesso negado. Apenas o criador do board pode adicionar colunas.' })
  @ApiResponse({ status: 404, description: 'Board não encontrado.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async create(
    @Param('boardId') boardId: string,
    @Body() createDto: CreateRetroColumnDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.columnService.create(boardId, createDto, userId);
  }

  @Get('board/:boardId')
  @ApiOperation({ summary: 'Listar colunas de um board' })
  @ApiParam({ name: 'boardId', description: 'ID do board' })
  @ApiResponse({ status: 200, description: 'Lista de colunas retornada com sucesso.', type: [RetroColumnResponseDto] })
  @ApiResponse({ status: 404, description: 'Board não encontrado.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async findByBoardId(@Param('boardId') boardId: string) {
    return this.columnService.findByBoardId(boardId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar coluna por ID' })
  @ApiParam({ name: 'id', description: 'ID da coluna' })
  @ApiResponse({ status: 200, description: 'Coluna encontrada com sucesso.', type: RetroColumnResponseDto })
  @ApiResponse({ status: 404, description: 'Coluna não encontrada.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async findById(@Param('id') id: string) {
    return this.columnService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar coluna parcialmente' })
  @ApiParam({ name: 'id', description: 'ID da coluna' })
  @ApiResponse({ status: 200, description: 'Coluna atualizada com sucesso.', type: RetroColumnResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiResponse({ status: 403, description: 'Acesso negado. Apenas o criador do board pode editar colunas.' })
  @ApiResponse({ status: 404, description: 'Coluna não encontrada.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateRetroColumnDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.columnService.update(id, updateDto, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar coluna' })
  @ApiParam({ name: 'id', description: 'ID da coluna' })
  @ApiResponse({ status: 200, description: 'Coluna deletada com sucesso.', type: MessageResponseDto })
  @ApiResponse({ status: 403, description: 'Acesso negado. Apenas o criador do board pode deletar colunas.' })
  @ApiResponse({ status: 404, description: 'Coluna não encontrada.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    await this.columnService.delete(id, userId);
    return { message: 'Column deleted successfully' };
  }

  @Put('board/:boardId/reorder')
  @ApiOperation({ summary: 'Reordenar colunas de um board' })
  @ApiParam({ name: 'boardId', description: 'ID do board' })
  @ApiResponse({ status: 200, description: 'Colunas reordenadas com sucesso.', type: [RetroColumnResponseDto] })
  @ApiResponse({ status: 400, description: 'Lista de IDs inválida.' })
  @ApiResponse({ status: 403, description: 'Acesso negado. Apenas o criador do board pode reordenar colunas.' })
  @ApiResponse({ status: 404, description: 'Board não encontrado.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async reorderColumns(
    @Param('boardId') boardId: string,
    @Body('columnIds') columnIds: string[],
    @CurrentUser('id') userId: string,
  ) {
    return this.columnService.reorderColumns(boardId, columnIds, userId);
  }
}
