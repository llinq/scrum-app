import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RetroBoard } from "../../shared/database/entities/retro-board.entity";
import { RetroColumn } from "../../shared/database/entities/retro-column.entity";
import { RetroCard } from "../../shared/database/entities/retro-card.entity";
import { RetroCardVote } from "../../shared/database/entities/retro-card-vote.entity";

// Controllers
import { RetroBoardController } from "./retro-board.controller";
import { RetroColumnController } from "./retro-column.controller";
import { RetroCardController } from "./retro-card.controller";

// Services
import { RetroBoardService } from "./retro-board.service";
import { RetroColumnService } from "./retro-column.service";
import { RetroCardService } from "./retro-card.service";

// Repositories
import { RetroBoardRepository } from "./retro-board.repository";
import { RetroColumnRepository } from "./retro-column.repository";
import { RetroCardRepository } from "./retro-card.repository";
import { JwtAuthGuard } from "src/common/guards";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../user/user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RetroBoard,
      RetroColumn,
      RetroCard,
      RetroCardVote,
    ]),
    AuthModule,
    UserModule,
  ],
  controllers: [
    RetroBoardController,
    RetroColumnController,
    RetroCardController,
  ],
  providers: [
    JwtAuthGuard,
    RetroBoardService,
    RetroColumnService,
    RetroCardService,
    RetroBoardRepository,
    RetroColumnRepository,
    RetroCardRepository,
  ],
  exports: [
    RetroBoardService,
    RetroColumnService,
    RetroCardService,
    RetroBoardRepository,
    RetroColumnRepository,
    RetroCardRepository,
  ],
})
export class RetroModule {}
