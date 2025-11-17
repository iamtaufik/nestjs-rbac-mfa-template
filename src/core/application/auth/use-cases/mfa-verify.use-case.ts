import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { authenticator } from 'otplib';
import { JwtService } from '@nestjs/jwt';

import { MfaFactorOrmEntity } from 'src/infrastructure/database/entities/mfa-factor.orm-entity';

@Injectable()
export class MfaVerifyUseCase {
  constructor(
    @InjectRepository(MfaFactorOrmEntity)
    private readonly mfaRepo: Repository<MfaFactorOrmEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async execute(userId: string, token: string) {
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

    if (!isValid) throw new UnauthorizedException('Invalid MFA token');

    if (!mfa.isActive) {
      mfa.isActive = true;
      await this.mfaRepo.save(mfa);
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
