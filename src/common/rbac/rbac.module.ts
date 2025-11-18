// src/common/rbac/rbac.module.ts
import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionOrmEntity } from 'src/infrastructure/database/entities/role-perm.orm-entity';
import { UserRoleOrmEntity } from 'src/infrastructure/database/entities/user-role.orm-entity';
import { UserOrmEntity } from 'src/infrastructure/database/entities/user.orm-entity';
import { jwtConstant } from 'src/utils/constant';
import { AuthGuard } from '../guards/auth.guard';
import { RbacGuard } from '../guards/rbac.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserOrmEntity,
      UserRoleOrmEntity,
      RolePermissionOrmEntity,
    ]),
    JwtModule.register({
      secret: jwtConstant.secret,
    }),
  ],
  providers: [AuthGuard, RbacGuard],
})
export class RbacModule {}
