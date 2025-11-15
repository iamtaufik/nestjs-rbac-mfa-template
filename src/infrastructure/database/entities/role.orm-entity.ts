import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { UserRoleOrmEntity } from './user-role.orm-entity';
import { RolePageOrmEntity } from './role-page.orm-entity';
import { RolePermissionOrmEntity } from './role-perm.orm-entity';

@Entity({ name: 'M_ROLE', schema: 'public' })
@Index('UX_M_ROLE_ROLCD', ['code'], { unique: true })
export class RoleOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'ROLCD', length: 50 })
  code: string;

  @Column({ name: 'ROLNM', length: 100 })
  name: string;

  @Column({ name: 'DESCR', type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'ISACT', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'CRDAT', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'UPDAT', type: 'timestamptz', nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => UserRoleOrmEntity, (ur) => ur.role)
  userRoles: UserRoleOrmEntity[];

  @OneToMany(() => RolePageOrmEntity, (rp) => rp.role)
  rolePages: RolePageOrmEntity[];

  @OneToMany(() => RolePermissionOrmEntity, (rp) => rp.role)
  rolePerms: RolePermissionOrmEntity[];
}
