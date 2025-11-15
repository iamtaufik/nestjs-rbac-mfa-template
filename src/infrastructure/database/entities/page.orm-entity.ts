import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { RolePageOrmEntity } from './role-page.orm-entity';
import { PermOrmEntity } from './perm.orm-entity';

@Entity({ name: 'M_PAGE', schema: 'public' })
@Index('UX_M_PAGE_PGCD', ['code'], { unique: true })
@Index('UX_M_PAGE_PGURL', ['url'], { unique: true })
export class PageOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'PGCD', length: 100 })
  code: string;

  @Column({ name: 'PGNM', length: 150 })
  name: string;

  @Column({ name: 'PGURL', length: 255 })
  url: string;

  @Column({ name: 'PGICON', length: 100, nullable: true, type: 'varchar' })
  icon?: string | null;

  @Column({ name: 'PGORD', type: 'int', default: 0 })
  order: number;

  @ManyToOne(() => PageOrmEntity, (page) => page.children, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'PRNTID' })
  parent: PageOrmEntity | null;

  @OneToMany(() => PageOrmEntity, (page) => page.parent)
  children: PageOrmEntity[];

  @Column({ name: 'ISACT', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'CRDAT', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'UPDAT', type: 'timestamptz', nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => RolePageOrmEntity, (rp) => rp.page)
  rolePages: RolePageOrmEntity[];

  @OneToMany(() => PermOrmEntity, (perm) => perm.page)
  permissions: PermOrmEntity[];
}
