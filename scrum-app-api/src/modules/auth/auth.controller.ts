import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { CreateGuestUserDto } from "../user/dto/create-guest-user.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators";
import { IUser } from "../user/user.entity";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("guest")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Criar usuário convidado" })
  @ApiResponse({
    status: 201,
    description: "Usuário convidado criado com sucesso",
  })
  async createGuest(@Body() createGuestUserDto: CreateGuestUserDto) {
    return this.authService.createGuest(createGuestUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Obter informações do usuário autenticado" })
  @ApiResponse({ status: 200, description: "Usuário autenticado" })
  @ApiResponse({ status: 401, description: "Token de autenticação inválido" })
  me(@CurrentUser() user: IUser) {
    return { user };
  }
}
