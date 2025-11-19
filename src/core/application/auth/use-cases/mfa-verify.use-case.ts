import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { authenticator } from 'otplib';
import { JwtService } from '@nestjs/jwt';

import { MfaFactorOrmEntity } from 'src/infrastructure/database/entities/mfa-factor.orm-entity';
import { UserOrmEntity } from 'src/infrastructure/database/entities/user.orm-entity';

@Injectable()
export class MfaVerifyUseCase {
  constructor(
    @InjectRepository(MfaFactorOrmEntity)
    private readonly mfaRepo: Repository<MfaFactorOrmEntity>,

    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async execute(userId: string, token: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const now = new Date();
    if (user.freezeUntil && user.freezeUntil > now) {
      throw new UnauthorizedException(
        'Account temporarily locked. Please try again later.',
        {
          description: user.freezeUntil.toISOString(),
        },
      );
    }

    if (user.freezeUntil && user.freezeUntil <= now) {
      user.freezeUntil = null;
      user.failedAttemptCount = 0;
      await this.userRepo.save(user);
    }

    const mfa = await this.mfaRepo.findOne({
      where: {
        user: {
          id: userId,
        },
        factorType: 'TOTP',
        isPrimary: true,
      },
    });

    if (!mfa) throw new UnauthorizedException('MFA not setup');

    const isValid = authenticator.verify({
      secret: mfa.secretKey,
      token,
    });

    if (!isValid) {
      user.failedAttemptCount = (user.failedAttemptCount ?? 0) + 1;

      if (user.failedAttemptCount >= 5) {
        const lockDurationMs = 2 * 60 * 1000;
        user.freezeUntil = new Date(Date.now() + lockDurationMs);
      }

      await this.userRepo.save(user);

      throw new UnauthorizedException('Invalid MFA token');
    }

    if (!mfa.isActive) {
      mfa.isActive = true;
      await this.mfaRepo.save(mfa);
    }

    if (user.failedAttemptCount || user.freezeUntil) {
      user.failedAttemptCount = 0;
      user.freezeUntil = null;
      await this.userRepo.save(user);
    }

    const jwtPayload = {
      sub: userId,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '20m',
    });

    return { accessToken, refreshToken };
  }
}
