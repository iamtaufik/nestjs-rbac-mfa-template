import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { authenticator } from 'otplib';

import { MfaFactorOrmEntity } from 'src/infrastructure/database/entities/mfa-factor.orm-entity';

@Injectable()
export class MfaVerifyUseCase {
  constructor(
    @InjectRepository(MfaFactorOrmEntity)
    private readonly mfaRepo: Repository<MfaFactorOrmEntity>,
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

    console.log('isValid', isValid);

    if (!isValid) throw new UnauthorizedException('Invalid MFA token');

    mfa.isActive = true;

    await this.mfaRepo.save(mfa);

    return { success: true };
  }
}
