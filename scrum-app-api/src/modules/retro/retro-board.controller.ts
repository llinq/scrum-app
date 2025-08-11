import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  ValidationPipe,
  UsePipes,
  Patch,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "../../common/decorators/user.decorator";
import { MessageResponseDto } from "../../shared/dto/message-response.dto";
import { RetroBoardService } from "./retro-board.service";
import { CreateRetroBoardDto } from "./dto/create-retro-board.dto";
import { UpdateRetroBoardDto } from "./dto/update-retro-board.dto";
import { RetroBoardResponseDto } from "./dto/retro-board-response.dto";

@ApiTags("Retro Boards")
@ApiBearerAuth()
@Controller("retro-boards")
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class RetroBoardController {
  constructor(private readonly boardService: RetroBoardService) {}

  @Post()
  @ApiOperation({ summary: "Criar um novo board de retrospectiva" })
  @ApiResponse({
    status: 201,
    description: "Board criado com sucesso.",
    type: RetroBoardResponseDto,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async create(
    @Body() createDto: CreateRetroBoardDto,
    @CurrentUser("id") userId: string
  ) {
    return this.boardService.create(createDto, userId);
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os boards ativos" })
  @ApiResponse({
    status: 200,
    description: "Lista de boards retornada com sucesso.",
    type: [RetroBoardResponseDto],
  })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async findAll() {
    return this.boardService.findAll();
  }

  @Get("my-boards")
  @ApiOperation({ summary: "Listar meus boards de retrospectiva" })
  @ApiResponse({
    status: 200,
    description: "Lista de boards do usuário retornada com sucesso.",
    type: [RetroBoardResponseDto],
  })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async findMyBoards(@CurrentUser("id") userId: string) {
    return this.boardService.findByCreator(userId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar board por ID" })
  @ApiParam({ name: "id", description: "ID do board" })
  @ApiResponse({
    status: 200,
    description: "Board encontrado com sucesso.",
    type: RetroBoardResponseDto,
  })
  @ApiResponse({ status: 404, description: "Board não encontrado." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async findById(@CurrentUser('id') userId: string, @Param("id") id: string) {
    const board = await this.boardService.findById(id);
    board.can_edit = board.created_by === userId;
    return board;
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar board de retrospectiva" })
  @ApiParam({ name: "id", description: "ID do board" })
  @ApiResponse({
    status: 200,
    description: "Board atualizado com sucesso.",
    type: RetroBoardResponseDto,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos." })
  @ApiResponse({
    status: 403,
    description: "Acesso negado. Apenas o criador pode editar.",
  })
  @ApiResponse({ status: 404, description: "Board não encontrado." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateRetroBoardDto,
    @CurrentUser("id") userId: string
  ) {
    return this.boardService.update(id, updateDto, userId);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Deletar board de retrospectiva" })
  @ApiParam({ name: "id", description: "ID do board" })
  @ApiResponse({
    status: 200,
    description: "Board deletado com sucesso.",
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Acesso negado. Apenas o criador pode deletar.",
  })
  @ApiResponse({ status: 404, description: "Board não encontrado." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async delete(@Param("id") id: string, @CurrentUser("id") userId: string) {
    await this.boardService.delete(id, userId);
    return { message: "Board deleted successfully" };
  }

  @Put(":id/archive")
  @ApiOperation({ summary: "Arquivar board de retrospectiva" })
  @ApiParam({ name: "id", description: "ID do board" })
  @ApiResponse({
    status: 200,
    description: "Board arquivado com sucesso.",
    type: RetroBoardResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: "Acesso negado. Apenas o criador pode arquivar.",
  })
  @ApiResponse({ status: 404, description: "Board não encontrado." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async archive(@Param("id") id: string, @CurrentUser("id") userId: string) {
    return this.boardService.archive(id, userId);
  }
}
