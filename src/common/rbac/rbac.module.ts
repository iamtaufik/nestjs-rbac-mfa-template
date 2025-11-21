import { Module } from '@nestjs/common';
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
  exports: [AuthGuard, RbacGuard, TypeOrmModule, JwtModule],
})
export class RbacModule {}
