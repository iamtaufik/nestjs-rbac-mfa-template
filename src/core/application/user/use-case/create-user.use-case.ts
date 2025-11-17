import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { UserOrmEntity } from 'src/infrastructure/database/entities/user.orm-entity';
import { CreateUserInputDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
  ) {}

  async execute(input: CreateUserInputDto) {
    const existing = await this.userRepo.findOne({
      where: [{ username: input.username }, { email: input.email }],
    });

    if (existing) {
      throw new ConflictException('Username or email already used');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = this.userRepo.create({
      username: input.username,
      email: input.email,
      password: hashedPassword,
      isActive: input.isActive,
    });

    const saved = await this.userRepo.save(user);
    return saved;
  }
}
