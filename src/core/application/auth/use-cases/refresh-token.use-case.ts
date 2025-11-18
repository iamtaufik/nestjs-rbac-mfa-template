import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(userId: string) {
    const jwtPayload = {
      sub: userId,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '20m',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
