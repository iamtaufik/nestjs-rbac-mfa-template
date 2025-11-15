import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { RoleOrmEntity } from './role.orm-entity';

@Entity({ name: 'M_USERROLE', schema: 'public' })
@Unique('UK_M_USERROLE_USER_ROLE_BE', ['user', 'role', 'begda'])
export class UserRoleOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @ManyToOne(() => UserOrmEntity, (user) => user.userRoles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'USERID' })
  user: UserOrmEntity;

  @ManyToOne(() => RoleOrmEntity, (role) => role.userRoles, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'ROLEID' })
  role: RoleOrmEntity;

  @Column({ name: 'BEGDA', type: 'date', default: () => 'current_date' })
  begda: string;

  @Column({ name: 'ENDDA', type: 'date', nullable: true })
  endda: string | null;

  @Column({ name: 'CRDAT', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'UPDAT', type: 'timestamptz', nullable: true })
  updatedAt: Date | null;
}
