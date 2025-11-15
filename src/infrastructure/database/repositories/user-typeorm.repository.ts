import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { User } from '../../../core/domain/user/user.entity';
import { UserRepository } from '../../../core/domain/user/user.repository';

export class UserTypeOrmRepository implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    const row = await this.repo.findOne({ where: { username: username } });
    if (!row) return null;
    return new User(
      row.id,
      row.username,
      row.email,
      row.password,
      row.isActive,
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const row = await this.repo.findOne({ where: { email: email } });
    if (!row) return null;
    return new User(
      row.id,
      row.username,
      row.email,
      row.password,
      row.isActive,
    );
  }

  async save(user: User): Promise<User> {
    const entity = this.repo.create({
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      isActive: user.isActive,
    });

    const savedUser = await this.repo.save(entity);

    return user;
  }
}
