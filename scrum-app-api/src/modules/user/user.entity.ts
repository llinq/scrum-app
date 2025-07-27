export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string | null,
    public readonly name: string,
    public readonly avatar_url: string | null,
    public readonly is_guest: boolean,
    public readonly guest_name: string | null,
    public readonly created_at: Date,
    public readonly updated_at: Date,
    public readonly last_login: Date | null,
  ) {}

  static createGuest(name: string): UserEntity {
    return new UserEntity(
      crypto.randomUUID(),
      null,
      name,
      null,
      true,
      name,
      new Date(),
      new Date(),
      null,
    );
  }

  static createUser(email: string, name: string): UserEntity {
    return new UserEntity(
      crypto.randomUUID(),
      email,
      name,
      null,
      false,
      null,
      new Date(),
      new Date(),
      null,
    );
  }
} 