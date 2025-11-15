import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Index,
} from 'typeorm';
import { UserRoleOrmEntity } from './user-role.orm-entity';
import { MfaFactorOrmEntity } from './mfa-factor.orm-entity';
import { MfaTokenOrmEntity } from './mfa-token.orm-entity';

@Entity({ name: 'M_USER', schema: 'public' })
@Index('UX_M_USER_USRNM', ['username'], { unique: true })
@Index('UX_M_USER_EMADR', ['email'], { unique: true })
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'USRNM', length: 100 })
  username: string;

  @Column({ name: 'EMADR', length: 255 })
  email: string;

  @Column({ name: 'PWD', length: 255 })
  password: string;

  @Column({ name: 'ISACT', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'CRDAT', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'UPDAT', type: 'timestamptz', nullable: true })
  updatedAt: Date | null;

  @OneToMany(() => UserRoleOrmEntity, (ur) => ur.user)
  userRoles: UserRoleOrmEntity[];

  @OneToMany(() => MfaFactorOrmEntity, (factor) => factor.user)
  mfaFactors: MfaFactorOrmEntity[];

  @OneToMany(() => MfaTokenOrmEntity, (token) => token.user)
  mfaTokens: MfaTokenOrmEntity[];
}
