import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import {
  type UserRepository,
  UserRepositoryToken,
} from '../../../domain/user/user.repository';
import { RegisterUserDto } from '../dto/register.dto';
import { User } from '../../../domain/user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: RegisterUserDto): Promise<User> {
    const existUser = await this.userRepository.findByUsername(input.username);
    if (existUser) throw new BadRequestException('Username already exists');

    const existEmail = await this.userRepository.findByEmail(input.email);
    if (existEmail) throw new BadRequestException('Email already exists');

    const hashed = await bcrypt.hash(input.password, 10);

    const user = new User(
      crypto.randomUUID(),
      input.username,
      input.email,
      hashed,
      true,
    );

    return this.userRepository.save(user);
  }
}
