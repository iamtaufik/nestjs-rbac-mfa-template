import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PermOrmEntity } from 'src/infrastructure/database/entities/perm.orm-entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetPermissionsUseCase {
  constructor(
    @InjectRepository(PermOrmEntity)
    private readonly permRepo: Repository<PermOrmEntity>,
  ) {}

  async execute(): Promise<PermOrmEntity[]> {
    const permission = await this.permRepo.find();

    return permission;
  }
}
