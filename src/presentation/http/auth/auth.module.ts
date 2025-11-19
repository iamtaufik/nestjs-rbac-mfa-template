import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstant } from 'src/utils/constant';

import { AuthController } from './auth.controller';

import { UserRepositoryToken } from 'src/core/domain/user/user.repository';
import { UserTypeOrmRepository } from 'src/infrastructure/database/repositories/user-typeorm.repository';

import { UserOrmEntity } from 'src/infrastructure/database/entities/user.orm-entity';
import { MfaFactorOrmEntity } from 'src/infrastructure/database/entities/mfa-factor.orm-entity';

import { RegisterUserUseCase } from 'src/core/application/auth/use-cases/register-user.use-case';
import { LoginUserUseCase } from 'src/core/application/auth/use-cases/login-user.use-case';
import { MfaSetupUseCase } from 'src/core/application/auth/use-cases/mfa-setup.use-case';
import { MfaVerifyUseCase } from 'src/core/application/auth/use-cases/mfa-verify.use-case';
import { RbacModule } from 'src/common/rbac/rbac.module';
import { MeUseCase } from 'src/core/application/auth/use-cases/me.use-case';
import { RefreshTokenUseCase } from 'src/core/application/auth/use-cases/refresh-token.use-case';
import {
  ThrottlerGuard,
  ThrottlerModule,
  ThrottlerStorage,
} from '@nestjs/throttler';
import { EmailQueueService } from 'src/infrastructure/queues/jobs/email-queue/email-queue.service';
import { EmailQueueModule } from 'src/infrastructure/queues/jobs/email-queue/email-queue.modul';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      errorMessage(context, throttlerLimitDetail) {
        console.log('throttlerLimitDetail', throttlerLimitDetail);
        return 'Too Many Requests';
      },
      throttlers: [
        {
          ttl: 6000,
          limit: 3,
        },
      ],
    }),
    TypeOrmModule.forFeature([UserOrmEntity, MfaFactorOrmEntity]),
    JwtModule.register({
      secret: jwtConstant.secret,
      // kalau butuh signOptions bisa ditaruh di sini juga
    }),
    RbacModule,
    EmailQueueModule,
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    MfaSetupUseCase,
    MfaVerifyUseCase,
    MeUseCase,
    RefreshTokenUseCase,
    ThrottlerGuard,
    {
      provide: UserRepositoryToken,
      useClass: UserTypeOrmRepository,
    },
  ],
})
export class AuthModule {}
