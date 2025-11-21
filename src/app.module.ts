import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './presentation/http/auth/auth.module';
import { UserModule } from './presentation/http/user/user.module';
import { SchedulerModule } from './infrastructure/scheduling/scheduler.module';
import { QueueModule } from './infrastructure/queues/queue.module';
import { RoleModule } from './presentation/http/role/role.module';
import { PermissionModule } from './presentation/http/permission/permission.module';

@Module({
  imports: [
    SchedulerModule,
    QueueModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
  ],
  providers: [],
})
export class AppModule {}
