import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleOrmEntity } from 'src/infrastructure/database/entities/role.orm-entity';
import { Repository } from 'typeorm';
import { RoleDto } from './dto/role.dto';

@Injectable()
export class GetRolesUseCase {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepo: Repository<RoleOrmEntity>,
  ) {}

  async execute(): Promise<RoleDto[]> {
    const roles = await this.roleRepo.find({
      select: {
        id: true,
        code: true,
        name: true,
        description: true,
        isActive: true,
        createdAt: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return roles as RoleDto[];
  }
}
