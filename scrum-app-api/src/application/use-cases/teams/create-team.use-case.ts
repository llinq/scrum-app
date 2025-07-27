import { Injectable } from '@nestjs/common';
import { ITeamRepository } from '../../interfaces/team.repository.interface';
import { TeamEntity } from '../../../domain/entities/team.entity';

export interface CreateTeamRequest {
  name: string;
  description?: string;
  createdBy: string;
}

export interface CreateTeamResponse {
  team: TeamEntity;
}

@Injectable()
export class CreateTeamUseCase {
  constructor(private readonly teamRepository: ITeamRepository) {}

  async execute(request: CreateTeamRequest): Promise<CreateTeamResponse> {
    const team = TeamEntity.create(
      request.name,
      request.description || null,
      request.createdBy,
    );
    
    const savedTeam = await this.teamRepository.create(team);
    
    return {
      team: savedTeam,
    };
  }
} 