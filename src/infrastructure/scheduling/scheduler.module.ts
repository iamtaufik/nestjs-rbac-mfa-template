
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GenerateReportCorn } from './cron-jobs/generate-report.cron';

@Module({
  imports: [
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [GenerateReportCorn],
})
export class SchedulerModule {}
