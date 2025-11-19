import { Logger } from '@nestjs/common';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('email')
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    this.logger.log(`Processing job ${job.id} (${job.name})`);

    switch (job.name) {
      case 'send-welcome-email':
        await this.handleWelcomeEmail(job.data);
        break;

      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handleWelcomeEmail(data: {
    userId: string;
    email: string;
    name: string;
  }) {
    this.logger.log(
      `Sending welcome email to ${data.email} (userId=${data.userId})`,
    );

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 5000));

    this.logger.log(`Welcome email sent to ${data.email}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job completed: ${job.id} (${job.name})`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job | undefined, err: Error) {
    this.logger.error(
      `Job failed: ${job?.id} (${job?.name}) - ${err.message}`,
      err.stack,
    );
  }
}
