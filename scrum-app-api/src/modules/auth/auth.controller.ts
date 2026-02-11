import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Res,
  Req,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { CreateGuestUserDto } from "../user/dto/create-guest-user.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { GoogleAuthGuard } from "../../common/guards/google-auth.guard";
import { CurrentUser } from "src/common/decorators";
import { IUser } from "../user/user.entity";
import { UserService } from "../user/user.service";
import { isValidCallbackUrl } from "@scrum-app/shared";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

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

  @Get("google")
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: "Iniciar autenticação com Google" })
  @ApiResponse({
    status: 302,
    description: "Redirecionamento para Google OAuth",
  })
  async googleAuth() { 
    // Passport will automatically handle the state parameter from query string
  }

  @Get("google/callback")
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: "Callback do Google OAuth" })
  @ApiResponse({ status: 200, description: "Autenticação bem-sucedida" })
  async googleAuthRedirect(
    @CurrentUser() user: IUser,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = await this.authService.generateToken(user.id);
    // Express automatically decodes query parameters
    const state = (req.query.state as string) || '';

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    const callbackUrl = `/login/callback?token=${token}`;
    
    // Se houver um state (callbackUrl), valida e adiciona como parâmetro
    if (state && isValidCallbackUrl(state)) {
      // Re-encode for URL transmission
      return res.redirect(`${frontendUrl}${callbackUrl}&callbackUrl=${encodeURIComponent(state)}`);
    }
    
    return res.redirect(`${frontendUrl}${callbackUrl}`);
  }
}
