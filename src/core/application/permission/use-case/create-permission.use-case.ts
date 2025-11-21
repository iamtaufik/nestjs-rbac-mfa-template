import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermOrmEntity } from 'src/infrastructure/database/entities/perm.orm-entity';
import { QueryFailedError, Repository } from 'typeorm';
import { CreatePermissionDto } from '../dto/create-permission.dto';

@Injectable()
export class CreatePermissionUseCase {
  constructor(
    @InjectRepository(PermOrmEntity)
    private readonly permRepo: Repository<PermOrmEntity>,
  ) {}

  async execute(input: CreatePermissionDto) {
    const existing = await this.permRepo.findOne({
      where: { code: input.code },
    });

    if (existing) {
      throw new ConflictException(
        `Permission with code '${input.code}' already exists`,
      );
    }

    const permission = this.permRepo.create({
      code: input.code,
      name: input.name,
      description: input.description,
    });

    try {
      return await this.permRepo.save(permission);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverErr: any =
          (error as any).driverError ?? (error as any).detail ?? null;
        const code =
          (error as any).code ?? (driverErr && driverErr.code) ?? null;

        if (code === '23505') {
          throw new ConflictException(
            `Permission with code '${input.code}' already exists`,
          );
        }
      }

      throw new InternalServerErrorException('Failed to create permission');
    }
  }
}
