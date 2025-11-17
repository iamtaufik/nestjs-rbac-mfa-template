import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './presentation/http/auth/auth.module';
import { UserModule } from './presentation/http/user/user.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule],
  providers: [AppService],
})
export class AppModule {}
