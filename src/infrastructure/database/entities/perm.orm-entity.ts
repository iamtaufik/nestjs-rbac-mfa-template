import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { PageOrmEntity } from './page.orm-entity';
import { RolePermissionOrmEntity } from './role-perm.orm-entity';

@Entity({ name: 'M_PERM', schema: 'public' })
@Index('UX_M_PERM_PRMCD', ['code'], { unique: true })
export class PermOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'PRMCD', length: 100 })
  code: string;

  @Column({ name: 'PRMNM', length: 150 })
  name: string;

  @Column({ name: 'DESCR', type: 'text', nullable: true })
  description: string | null;

  @ManyToOne(() => PageOrmEntity, (page) => page.permissions, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'PGID' })
  page: PageOrmEntity | null;

  @Column({ name: 'ISACT', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'CRDAT', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'UPDAT', type: 'timestamptz', nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => RolePermissionOrmEntity, (rp) => rp.permission)
  rolePerms: RolePermissionOrmEntity[];
}
