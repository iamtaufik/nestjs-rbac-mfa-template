import 'dotenv/config';
import { BullModule } from '@nestjs/bullmq';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailQueueService } from './email-queue.service';
import { EmailProcessor } from './email.processor';
import { MailModule } from 'src/infrastructure/mail/mail.module';

@Module({
  imports: [
    MailModule,
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  providers: [EmailQueueService, EmailProcessor],
  exports: [EmailQueueService],
})
export class EmailQueueModule {}
