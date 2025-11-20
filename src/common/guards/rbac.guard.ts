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

  /**
   * Mendukung requiredPermissions:
   * - 'SOME_PERMISSION_CODE'  -> cek RolePermission.permission.code
   * - 'PAGE_CODE:canView'     -> cek RolePage.page.code dan rolePage.canView = true
   * - 'PAGE_CODE:view'        -> alias untuk canView (view/create/update/delete supported)
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException();
    }

    const userId = user.id as string;

    // parsing requiredPermissions
    const permCodes: string[] = []; // plain permission codes
    const pageChecks: Record<string, string[]> = {
      canView: [],
      canCreate: [],
      canUpdate: [],
      canDelete: [],
    };

    const actionAlias: Record<string, keyof typeof pageChecks> = {
      view: 'canView',
      create: 'canCreate',
      update: 'canUpdate',
      delete: 'canDelete',
    };

    for (const rp of requiredPermissions) {
      const parts = rp.split(':').map((s) => s.trim());
      if (parts.length === 2) {
        const pageCode = parts[0];
        let action = parts[1];
        // normalize aliases like 'view' -> 'canView'
        if (actionAlias[action]) action = actionAlias[action];
        if (pageChecks[action as keyof typeof pageChecks] !== undefined) {
          pageChecks[action as keyof typeof pageChecks].push(pageCode);
          continue;
        }
      }
      // fallback: treat as permission code
      permCodes.push(rp);
    }

    // Build a single EXISTS query that checks either RolePermission OR RolePage flags
    const qb = this.userRoleRepo
      .createQueryBuilder('ur')
      .innerJoin('ur.user', 'u')
      .innerJoin('ur.role', 'r');

    // join optional relations for permission and page checks
    // leftJoin to allow either path to satisfy
    qb.leftJoin('r.rolePerms', 'rp').leftJoin('rp.permission', 'p');
    qb.leftJoin('r.rolePages', 'rpage').leftJoin('rpage.page', 'pg');

    qb.where('u.id = :userId', { userId });

    // Build OR conditions
    const orConditions: string[] = [];
    const params: Record<string, any> = { userId };

    if (permCodes.length > 0) {
      params['permCodes'] = permCodes;
      orConditions.push('p.code IN (:...permCodes)');
    }

    // For each action (canView/canCreate/...), add condition: pg.code IN (...) AND rpage.<flag> = true
    const actions: Array<keyof typeof pageChecks> = [
      'canView',
      'canCreate',
      'canUpdate',
      'canDelete',
    ];
    for (const a of actions) {
      const arr = pageChecks[a];
      if (arr && arr.length > 0) {
        const paramName = `pg_${a}`;
        params[paramName] = arr;
        // rpage column names in DB / entity are `canView`, `canCreate`, ...
        // we use rpage.<column> = true
        orConditions.push(
          `(pg.code IN (:...${paramName}) AND rpage.${a} = true)`,
        );
      }
    }

    if (orConditions.length === 0) {
      // nothing to check (shouldn't happen because requiredPermissions non-empty), but safe fallback
      return true;
    }

    // join the ORs with OR
    qb.andWhere(`(${orConditions.join(' OR ')})`, params);

    const hasPermission = await qb.getExists();

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
