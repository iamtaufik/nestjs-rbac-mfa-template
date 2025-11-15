import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity({ name: 'M_MFAFACTOR', schema: 'public' })
@Index('IX_M_MFAFACTOR_USERID', ['user'])
export class MfaFactorOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @ManyToOne(() => UserOrmEntity, (user) => user.mfaFactors, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'USERID' })
  user: UserOrmEntity;

  @Column({ name: 'FATYP', length: 20 })
  factorType: string; // 'TOTP', 'SMS', 'EMAIL', 'BACKUP'

  @Column({ name: 'SECRK', type: 'text' })
  secretKey: string;

  @Column({ name: 'ISPRM', type: 'boolean', default: false })
  isPrimary: boolean;

  @Column({ name: 'ISACT', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'CRDAT', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'UPDAT', type: 'timestamptz', nullable: true })
  updatedAt: Date | null;
}
