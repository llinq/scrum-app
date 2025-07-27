export class TeamEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly inviteCode: string,
    public readonly createdBy: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(name: string, description: string | null, createdBy: string): TeamEntity {
    return new TeamEntity(
      crypto.randomUUID(),
      name,
      description,
      crypto.randomUUID().replace(/-/g, '').substring(0, 16),
      createdBy,
      new Date(),
      new Date(),
    );
  }
} 