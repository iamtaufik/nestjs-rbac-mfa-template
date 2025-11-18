import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrmEntity } from 'src/infrastructure/database/entities/user.orm-entity';
import { Repository } from 'typeorm';
import { MeDto, MeMenuDto, MePermissionDto, MeRoleDto } from '../dto/me.dto';

@Injectable()
export class MeUseCase {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
  ) {}

  async execute(userId: string): Promise<MeDto> {
    const user = await this.userRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect(
        'u.userRoles',
        'ur',
        `
            ur.begda <= current_date
            AND (ur.endda IS NULL OR ur.endda >= current_date)
        `,
      )
      .leftJoinAndSelect('ur.role', 'r', 'r.isActive = :roleActive', {
        roleActive: true,
      })
      .leftJoinAndSelect('r.rolePages', 'rp')
      .leftJoinAndSelect('rp.page', 'p', 'p.isActive = :pageActive', {
        pageActive: true,
      })
      .leftJoinAndSelect('r.rolePerms', 'rperm')
      .leftJoinAndSelect(
        'rperm.permission',
        'perm',
        'perm.isActive = :permActive',
        {
          permActive: true,
        },
      )
      .leftJoinAndSelect('perm.page', 'permPage')
      .where('u.id = :userId', { userId })
      .andWhere('u.isActive = :isActive', { isActive: true })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roles: MeRoleDto[] = (user.userRoles ?? [])
      .filter((ur) => !!ur.role)
      .map((ur) => {
        const role = ur.role!;

        const pages: MeMenuDto[] = (role.rolePages ?? [])
          .filter((rp) => rp.page && rp.canView) // hanya menu yang bisa dilihat
          .map((rp) => ({
            id: rp.page.id,
            code: rp.page.code,
            name: rp.page.name,
            url: rp.page.url,
            icon: rp.page.icon,
            order: rp.page.order,
            parentId: rp.page.parent ? rp.page.parent.id : null,

            canView: rp.canView,
            canCreate: rp.canCreate,
            canUpdate: rp.canUpdate,
            canDelete: rp.canDelete,
          }));

        const permissions: MePermissionDto[] = (role.rolePerms ?? [])
          .filter((rp) => !!rp.permission)
          .map((rp) => ({
            id: rp.permission.id,
            code: rp.permission.code,
            name: rp.permission.name,
            pageId: rp.permission.page ? rp.permission.page.id : null,
            pageCode: rp.permission.page ? rp.permission.page.code : null,
          }));

        return {
          id: role.id,
          code: role.code,
          name: role.name,
          pages,
          permissions,
        };
      });

    const response: MeDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles,
    };

    return response;
  }
}
