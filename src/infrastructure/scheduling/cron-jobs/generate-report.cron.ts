import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class GenerateReportCorn {
  private readonly logger = new Logger(GenerateReportCorn.name);

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handle() {
    this.logger.debug('Called every 5 second');
  }
}
