import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

import { UserRepositoryToken } from 'src/core/domain/user/user.repository';
import { UserTypeOrmRepository } from 'src/infrastructure/database/repositories/user-typeorm.repository';

import { UserOrmEntity } from 'src/infrastructure/database/entities/user.orm-entity';
import { MfaFactorOrmEntity } from 'src/infrastructure/database/entities/mfa-factor.orm-entity';

import { RegisterUserUseCase } from 'src/core/application/auth/use-cases/register-user.use-case';
import { LoginUserUseCase } from 'src/core/application/auth/use-cases/login-user.use-case';
import { MfaSetupUseCase } from 'src/core/application/auth/use-cases/mfa-setup.use-case';
import { MfaVerifyUseCase } from 'src/core/application/auth/use-cases/mfa-verify.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity, MfaFactorOrmEntity]),
    JwtModule.register({
      secret: 'must be secret',
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    MfaSetupUseCase,
    MfaVerifyUseCase,
    {
      provide: UserRepositoryToken,
      useClass: UserTypeOrmRepository,
    },
  ],
})
export class AuthModule {}
