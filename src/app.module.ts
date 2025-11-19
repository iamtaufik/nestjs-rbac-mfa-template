import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './presentation/http/auth/auth.module';
import { UserModule } from './presentation/http/user/user.module';
import { SchedulerModule } from './infrastructure/scheduling/scheduler.module';
import { QueueModule } from './infrastructure/queues/queue.module';

@Module({
  imports: [
    SchedulerModule,
    QueueModule,
    DatabaseModule,
    AuthModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
