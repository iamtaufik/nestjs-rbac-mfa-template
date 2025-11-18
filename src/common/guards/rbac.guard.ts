import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRoleOrmEntity } from 'src/infrastructure/database/entities/user-role.orm-entity';

@Injectable()
export class RbacGuard implements CanActivate {
    constructor(
        @InjectRepository(UserRoleOrmEntity)
        private readonly userRoleRepo: Repository<UserRoleOrmEntity>,
        
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException();
        }

        const userId = user.id as string;

        const hasPermission = await this.userRoleRepo
        .createQueryBuilder('ur')
        .innerJoin('ur.user', 'u') // relation ke UserOrmEntity
        .innerJoin('ur.role', 'r') // relation ke RoleOrmEntity
        .innerJoin('r.rolePerms', 'rp') // OneToMany Role → RolePerm
        .innerJoin('rp.permission', 'p') // ManyToOne RolePerm → Perm
        .where('u.id = :userId', { userId })
        .andWhere('p.code IN (:...perms)', {
            // NOTE: "code" di sini contoh property utk PRMCD
            perms: requiredPermissions,
        })
        .getExists()

        if (!hasPermission) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }

        return true;
    }
}