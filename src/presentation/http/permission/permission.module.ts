import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermOrmEntity } from 'src/infrastructure/database/entities/perm.orm-entity';
import { PermissionController } from './permission.controller';
import { CreatePermissionUseCase } from 'src/core/application/permission/use-case/create-permission.use-case';
import { RbacModule } from 'src/common/rbac/rbac.module';
import { UserOrmEntity } from 'src/infrastructure/database/entities/user.orm-entity';
import { UserRoleOrmEntity } from 'src/infrastructure/database/entities/user-role.orm-entity';
import { GetPermissionsUseCase } from 'src/core/application/permission/use-case/get-permissions.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([PermOrmEntity]), RbacModule],
  controllers: [PermissionController],
  providers: [CreatePermissionUseCase, GetPermissionsUseCase],
})
export class PermissionModule {}
