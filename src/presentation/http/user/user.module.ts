// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from 'src/infrastructure/database/entities/user.orm-entity';
import { CreateUserUseCase } from 'src/core/application/user/use-case/create-user.use-case';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from 'src/utils/constant';
import { RbacModule } from 'src/common/rbac/rbac.module';
import { UserRoleOrmEntity } from 'src/infrastructure/database/entities/user-role.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity, UserRoleOrmEntity]),
    JwtModule.register({
      secret: jwtConstant.secret,
    }),
    RbacModule,
  ],
  controllers: [UserController],
  providers: [CreateUserUseCase],
})
export class UserModule {}
