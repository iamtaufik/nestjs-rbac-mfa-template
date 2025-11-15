import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './presentation/http/auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  providers: [AppService],
})
export class AppModule {}
