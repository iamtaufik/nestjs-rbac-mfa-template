import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './presentation/http/auth/auth.module';
import { UserModule } from './presentation/http/user/user.module';
import { SchedulerModule } from './infrastructure/scheduling/scheduler.module';
import { QueueModule } from './infrastructure/queues/queue.module';
import { RoleModule } from './presentation/http/role/role.module';
import { PermissionModule } from './presentation/http/permission/permission.module';
import { S3Module } from './infrastructure/storage/s3.module';
import { ConfigModule } from '@nestjs/config';
import { FileModule } from './presentation/http/files/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SchedulerModule,
    S3Module,
    QueueModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    FileModule,
  ],
  providers: [],
})
export class AppModule {}
