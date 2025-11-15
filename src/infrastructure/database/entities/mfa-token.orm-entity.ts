import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity({ name: 'T_MFATOKEN', schema: 'public' })
@Index('IX_T_MFATOKEN_USER_FATYP', ['user', 'factorType', 'isUsed', 'expireAt'])
export class MfaTokenOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @ManyToOne(() => UserOrmEntity, (user) => user.mfaTokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'USERID' })
  user: UserOrmEntity;

  @Column({ name: 'FATYP', length: 20 })
  factorType: string;

  @Column({ name: 'TOKEN', length: 16 })
  token: string;

  @Column({ name: 'EXDAT', type: 'timestamptz' })
  expireAt: Date;

  @Column({ name: 'ISUSD', type: 'boolean', default: false })
  isUsed: boolean;

  @Column({ name: 'CRDAT', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;
}
