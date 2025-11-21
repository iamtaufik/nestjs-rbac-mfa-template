import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RbacModule } from 'src/common/rbac/rbac.module';
import { GetRolesUseCase } from 'src/core/application/role/use-case/get-roles.use-case';
import { RoleOrmEntity } from 'src/infrastructure/database/entities/role.orm-entity';
import { RoleController } from './role.controller';
import { UserRoleOrmEntity } from 'src/infrastructure/database/entities/user-role.orm-entity';
import { UserOrmEntity } from 'src/infrastructure/database/entities/user.orm-entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from 'src/utils/constant';
import { DetailRoleUseCase } from 'src/core/application/role/use-case/detail-role.use-case';
import { CreateRoleUseCase } from 'src/core/application/role/use-case/create-role.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity, UserRoleOrmEntity, RoleOrmEntity]),
    JwtModule.register({
      secret: jwtConstant.secret,
    }),
    RbacModule,
  ],
  controllers: [RoleController],
  providers: [GetRolesUseCase, DetailRoleUseCase, CreateRoleUseCase],
  exports: [GetRolesUseCase, DetailRoleUseCase, CreateRoleUseCase],
})
export class RoleModule {}
