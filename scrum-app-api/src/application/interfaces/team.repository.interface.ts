import { TeamEntity } from '../../domain/entities/team.entity';

export interface ITeamRepository {
  create(team: TeamEntity): Promise<TeamEntity>;
  findById(id: string): Promise<TeamEntity | null>;
  findByInviteCode(inviteCode: string): Promise<TeamEntity | null>;
  findByUserId(userId: string): Promise<TeamEntity[]>;
  update(id: string, data: Partial<TeamEntity>): Promise<TeamEntity>;
  delete(id: string): Promise<void>;
} 