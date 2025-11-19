import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';

@Entity({ name: 'AUTH_LOGS', schema: 'public' })
export class AuthLogOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'ID' })
  id: string;

  @Column({ name: 'USERID', type: 'uuid' })
  user: string;

  @Column({ name: 'USRATT', length: 150 })
  userAttribute: string;

  @Column({ name: 'EVTYPE', length: 50 })
  eventType: string;

  @Column({ name: 'IPADR', length: 150 })
  ipAddress: string;

  @Column({ name: 'USRAGT', type: 'text' })
  userAgent: string;

  @Column({ name: 'REASN', type: 'text' })
  reason: string;

  @Column({ name: 'CRDAT', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;
}
