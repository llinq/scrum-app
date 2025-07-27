import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateTeamUseCase } from '../../application/use-cases/teams/create-team.use-case';
import { CreateTeamDto } from '../../application/dtos/create-team.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Teams')
@Controller('teams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TeamsController {
  constructor(
    private readonly createTeamUseCase: CreateTeamUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar novo time' })
  @ApiResponse({ status: 201, description: 'Time criado com sucesso' })
  async create(@Body() createTeamDto: CreateTeamDto, @Request() req: any) {
    return this.createTeamUseCase.execute({
      ...createTeamDto,
      createdBy: req.user.id,
    });
  }
} 