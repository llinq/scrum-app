import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
// import { Team } from './entities/team.entity';
// import { Room } from './entities/room.entity';
// import { RetroCard } from './entities/retro-card.entity';
// import { RetroColumn } from './entities/retro-column.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USERNAME', 'scrum_user'),
        password: configService.get('DATABASE_PASSWORD', 'scrum_password'),
        database: configService.get('DATABASE_NAME', 'scrum-app'),
        entities: [User],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
  ],
})
export class DatabaseModule {} 