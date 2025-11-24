import 'dotenv/config';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EmailQueueModule } from './jobs/email-queue/email-queue.modul';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),
    EmailQueueModule,
  ],
})
export class QueueModule {}
