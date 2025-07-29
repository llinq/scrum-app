import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { User } from "../../shared/database/entities/user.entity";
import { UserModule } from "../user/user.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constants";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { GoogleAuthGuard } from "../../common/guards/google-auth.guard";
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: "24h" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, GoogleAuthGuard, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}
