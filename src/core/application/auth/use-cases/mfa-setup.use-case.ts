import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { authenticator } from 'otplib';
import { HashAlgorithms } from 'otplib/core';
import * as qrcode from 'qrcode';

import { UserOrmEntity } from 'src/infrastructure/database/entities/user.orm-entity';
import { MfaFactorOrmEntity } from 'src/infrastructure/database/entities/mfa-factor.orm-entity';

authenticator.options = {
  //   step: 30, // 30 detik per kode (standar)
  //   digits: 6, // 6 digit (standar authenticator app)
  algorithm: HashAlgorithms.SHA1,
  //   window: 1, // toleransi 1 step sebelum & sesudah (±30 detik)
};

@Injectable()
export class MfaSetupUseCase {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,

    @InjectRepository(MfaFactorOrmEntity)
    private readonly mfaRepo: Repository<MfaFactorOrmEntity>,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const secret = authenticator.generateSecret();

    const otpauth = authenticator.keyuri(user.username, 'YourAppName', secret);

    const qr = await qrcode.toDataURL(otpauth);

    // Check if user already has an active TOTP MFA factor and deactivate it
    const existingMfa = await this.mfaRepo.findOne({
      where: {
        user: {
          id: user.id,
        },
        factorType: 'TOTP',
        isPrimary: true,
      },
    });

    if (existingMfa) {
      existingMfa.isActive = false;
      existingMfa.isPrimary = false;
      await this.mfaRepo.save(existingMfa);
    }

    const mfaEntity = this.mfaRepo.create({
      user: {
        id: user.id,
      },
      factorType: 'TOTP',
      secretKey: secret,
      isPrimary: true,
      isActive: false,
    });

    await this.mfaRepo.save(mfaEntity);

    return {
      secret,
      qr,
    };
  }
}
