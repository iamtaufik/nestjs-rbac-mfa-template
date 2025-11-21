import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleOrmEntity } from 'src/infrastructure/database/entities/role.orm-entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateRoleDto } from '../dto/create-role.dto';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepo: Repository<RoleOrmEntity>,
  ) {}

  async execute(input: CreateRoleDto): Promise<RoleOrmEntity> {
    const existing = await this.roleRepo.findOne({
      where: { code: input.code },
    });

    if (existing) {
      throw new ConflictException(
        `Role with code '${input.code}' already exists`,
      );
    }

    const role = this.roleRepo.create({
      code: input.code,
      name: input.name,
      description: input.description ?? null,
      isActive: input.isActive,
    });

    try {
      return await this.roleRepo.save(role);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverErr: any =
          (error as any).driverError ?? (error as any).detail ?? null;
        const code =
          (error as any).code ?? (driverErr && driverErr.code) ?? null;

        if (code === '23505') {
          throw new ConflictException(
            `Role with code '${input.code}' already exists`,
          );
        }
      }

      throw new InternalServerErrorException('Failed to create role');
    }
  }
}
