import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { LoginRequestDto } from 'src/presentation/http/auth/dto/login-request.dto';
import { LoginResponseDto } from 'src/presentation/http/auth/dto/login-response.dto';

import { UserOrmEntity } from 'src/infrastructure/database/entities/user.orm-entity';
import { MfaFactorOrmEntity } from 'src/infrastructure/database/entities/mfa-factor.orm-entity';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,

    @InjectRepository(MfaFactorOrmEntity)
    private readonly mfaFactorRepo: Repository<MfaFactorOrmEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async execute(payload: LoginRequestDto): Promise<LoginResponseDto> {
    const { usernameOrEmail, password } = payload;

    const user = await this.userRepo.findOne({
      where: [
        // sesuaikan field dengan entity punyamu
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // asumsi field password di entity menyimpan hash dari PWD
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    const activeMfaCount = await this.mfaFactorRepo.count({
      where: {
        user: {
          id: user.id,
        },
        factorType: 'TOTP',
        isActive: true,
      },
    });

    const mfaRequired = activeMfaCount > 0;

    const jwtPayload = {
      sub: user.id,
    };

    const mfaTicket = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '5m',
    });

    const response: LoginResponseDto = {
      mfaRequired,
      mfaTicket,
    };

    return response;
  }
}
