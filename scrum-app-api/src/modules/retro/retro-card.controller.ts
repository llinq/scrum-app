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
  BadRequestException,
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
import { RetroCardService } from "./retro-card.service";
import { CreateRetroCardDto } from "./dto/create-retro-card.dto";
import { UpdateRetroCardDto } from "./dto/update-retro-card.dto";
import { RetroCardResponseDto } from "./dto/retro-card-response.dto";
import { MessageResponseDto } from "../../shared/dto/message-response.dto";

@ApiTags("Retro Cards")
@ApiBearerAuth()
@Controller("retro-cards")
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class RetroCardController {
  constructor(private readonly cardService: RetroCardService) {}

  @Post("column/:columnId")
  @ApiOperation({ summary: "Criar novo card em uma coluna" })
  @ApiParam({ name: "columnId", description: "ID da coluna" })
  @ApiResponse({
    status: 201,
    description: "Card criado com sucesso.",
    type: RetroCardResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Dados inválidos ou cards anônimos não permitidos.",
  })
  @ApiResponse({ status: 404, description: "Coluna não encontrada." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async create(
    @Param("columnId") columnId: string,
    @Body() createDto: CreateRetroCardDto,
    @CurrentUser("id") userId: string
  ) {
    const card = await this.cardService.create(columnId, createDto, userId);

    if (!card) {
      throw new BadRequestException("Failed to create retro card");
    }

    card.can_edit = true;

    return card;
  }

  @Get("column/:columnId")
  @ApiOperation({ summary: "Listar cards de uma coluna" })
  @ApiParam({ name: "columnId", description: "ID da coluna" })
  @ApiResponse({
    status: 200,
    description: "Lista de cards retornada com sucesso.",
    type: [RetroCardResponseDto],
  })
  @ApiResponse({ status: 404, description: "Coluna não encontrada." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async findByColumnId(
    @CurrentUser("id") userId: string,
    @Param("columnId") columnId: string
  ) {
    const cards = await this.cardService.findByColumnId(columnId, userId);
    return cards;
  }

  @Get("board/:boardId")
  @ApiOperation({ summary: "Listar cards de um board (ordenado por votos)" })
  @ApiParam({ name: "boardId", description: "ID do board" })
  @ApiResponse({
    status: 200,
    description: "Lista de cards retornada com sucesso.",
    type: [RetroCardResponseDto],
  })
  @ApiResponse({ status: 404, description: "Board não encontrado." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async findByBoardId(@Param("boardId") boardId: string) {
    return this.cardService.getCardsByBoardId(boardId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar card por ID" })
  @ApiParam({ name: "id", description: "ID do card" })
  @ApiResponse({
    status: 200,
    description: "Card encontrado com sucesso.",
    type: RetroCardResponseDto,
  })
  @ApiResponse({ status: 404, description: "Card não encontrado." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async findById(@CurrentUser("id") userId: string, @Param("id") id: string) {
    return this.cardService.findById(id, userId);
  }

  @Put(":id")
  @ApiOperation({ summary: "Atualizar card" })
  @ApiParam({ name: "id", description: "ID do card" })
  @ApiResponse({
    status: 200,
    description: "Card atualizado com sucesso.",
    type: RetroCardResponseDto,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos." })
  @ApiResponse({
    status: 403,
    description:
      "Acesso negado. Apenas o autor ou criador do board pode editar.",
  })
  @ApiResponse({ status: 404, description: "Card não encontrado." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async update(
    @Param("id") id: string,
    @Body() updateDto: UpdateRetroCardDto,
    @CurrentUser("id") userId: string
  ) {
    return this.cardService.update(id, updateDto, userId);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Deletar card" })
  @ApiParam({ name: "id", description: "ID do card" })
  @ApiResponse({
    status: 200,
    description: "Card deletado com sucesso.",
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 403,
    description:
      "Acesso negado. Apenas o autor ou criador do board pode deletar.",
  })
  @ApiResponse({ status: 404, description: "Card não encontrado." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async delete(@Param("id") id: string, @CurrentUser("id") userId: string) {
    await this.cardService.delete(id, userId);
    return { message: "Card deleted successfully" };
  }

  @Post(":id/vote")
  @ApiOperation({ summary: "Votar em um card" })
  @ApiParam({ name: "id", description: "ID do card" })
  @ApiResponse({
    status: 201,
    description: "Voto adicionado com sucesso.",
    type: MessageResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      "Limite de votos atingido, votação desabilitada ou já votou neste card.",
  })
  @ApiResponse({ status: 404, description: "Card não encontrado." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async addVote(
    @Param("id") cardId: string,
    @CurrentUser("id") userId: string
  ) {
    const vote = await this.cardService.addVote(cardId, userId);
    return { message: "Vote added successfully", vote };
  }

  @Delete(":id/vote")
  @ApiOperation({ summary: "Remover voto de um card" })
  @ApiParam({ name: "id", description: "ID do card" })
  @ApiResponse({
    status: 200,
    description: "Voto removido com sucesso.",
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 400, description: "Usuário não votou neste card." })
  @ApiResponse({ status: 404, description: "Card não encontrado." })
  @ApiResponse({ status: 401, description: "Não autorizado." })
  async removeVote(
    @Param("id") cardId: string,
    @CurrentUser("id") userId: string
  ) {
    await this.cardService.removeVote(cardId, userId);
    return { message: "Vote removed successfully" };
  }
}
