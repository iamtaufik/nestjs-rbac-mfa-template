// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from 'src/infrastructure/database/entities/user.orm-entity';
import { CreateUserUseCase } from 'src/core/application/user/use-case/create-user.use-case';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UserController],
  providers: [CreateUserUseCase],
  exports: [CreateUserUseCase],
})
export class UserModule {}
