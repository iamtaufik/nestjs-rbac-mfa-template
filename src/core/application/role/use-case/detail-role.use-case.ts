import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleOrmEntity } from 'src/infrastructure/database/entities/role.orm-entity';
import { Repository } from 'typeorm';

@Injectable()
export class DetailRoleUseCase {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepo: Repository<RoleOrmEntity>,
  ) {}

  async execute(roleId: string) {
    const role = await this.roleRepo.findOne({
      where: {
        id: roleId,
      },
      relations: {
        rolePages: true,
        rolePerms: {
          permission: true,
        },
      },
      // select: {
      //     rolePages: {
      //         id: true,

      //     }
      // }
    });

    return role;
  }
}
