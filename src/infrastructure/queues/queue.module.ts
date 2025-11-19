import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailQueueModule } from './jobs/email-queue/email-queue.modul';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
        password: 'taufikdev',
      },
    }),
    EmailQueueModule,
  ],
})
export class QueueModule {}
