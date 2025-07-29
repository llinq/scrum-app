import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { AuthService } from "../../modules/auth/auth.service";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.authService.validateToken(token);
      if (!payload) {
        throw new UnauthorizedException();
      }
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      request["user"] = user.toInterface();
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
