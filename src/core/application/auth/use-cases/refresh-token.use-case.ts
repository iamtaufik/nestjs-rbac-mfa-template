import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(userId: string) {
    const jwtPayload = {
      sub: userId,
    };

    // @ts-ignore
    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
    });

    // @ts-ignore
    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '20m',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
