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
  @Get("token")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verificar token de autenticação" })
  @ApiResponse({ status: 200, description: "Token de autenticação válido" })
  @ApiResponse({ status: 401, description: "Token de autenticação inválido" })
  checkToken() {
    return { message: "Token is valid" };
  }
}
