// src/core/infrastructure/database/entities/m-role-page.entity.ts
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
import { RoleOrmEntity } from './role.orm-entity'; // sesuaikan dengan nama file/class kamu
import { PageOrmEntity } from './page.orm-entity'; // sesuaikan dengan nama file/class kamu

@Entity({ name: 'M_ROLEPAGE' })
@Unique('UK_M_ROLEPAGE_ROLE_PAGE', ['roleId', 'pageId'])
export class RolePageOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column('uuid', { name: 'ROLEID' })
  roleId: string;

  @Column('uuid', { name: 'PAGEID' })
  pageId: string;

  @Column('boolean', { name: 'CANVW', default: true })
  canView: boolean;

  @Column('boolean', { name: 'CANCR', default: false })
  canCreate: boolean;

  @Column('boolean', { name: 'CANUP', default: false })
  canUpdate: boolean;

  @Column('boolean', { name: 'CANDL', default: false })
  canDelete: boolean;

  @CreateDateColumn({ name: 'CRDAT', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UPDAT', type: 'timestamptz', nullable: true })
  updatedAt: Date | null;

  @ManyToOne(() => RoleOrmEntity, (role) => role.rolePages, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ROLEID' })
  role: RoleOrmEntity;

  @ManyToOne(() => PageOrmEntity, (page) => page.rolePages, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'PAGEID' })
  page: PageOrmEntity;
}
