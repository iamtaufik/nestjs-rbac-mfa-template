import { User } from './user.entity';

export const UserRepositoryToken = 'UserRepositoryToken';

export interface UserRepository {
  findByUsername(username: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
}
