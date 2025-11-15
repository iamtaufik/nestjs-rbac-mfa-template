// src/core/infrastructure/database/entities/m-role-perm.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RoleOrmEntity } from './role.orm-entity'; // sesuaikan
import { PermOrmEntity } from './perm.orm-entity'; // sesuaikan (untuk M_PERM)

@Entity({ name: 'M_ROLEPERM' })
@Unique('UK_M_ROLEPERM_ROLE_PERM', ['roleId', 'permId'])
export class RolePermissionOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column('uuid', { name: 'ROLEID' })
  roleId: string;

  @Column('uuid', { name: 'PERMID' })
  permId: string;

  @CreateDateColumn({ name: 'CRDAT', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UPDAT', type: 'timestamptz', nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => RoleOrmEntity, (role) => role.rolePerms, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ROLEID' })
  role: RoleOrmEntity;

  @ManyToOne(() => PermOrmEntity, (perm) => perm.rolePerms, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'PERMID' })
  permission: PermOrmEntity;
}
