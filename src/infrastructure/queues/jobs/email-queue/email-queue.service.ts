import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export interface SendWelcomeEmailPayload {
  userId: string;
  email: string;
  name: string;
}

@Injectable()
export class EmailQueueService {
  constructor(
    @InjectQueue('email')
    private readonly emailQueue: Queue,
  ) {}

  async enqueueWelcomeEmail(payload: SendWelcomeEmailPayload) {
    await this.emailQueue.add('send-welcome-email', payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 200,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }
}
