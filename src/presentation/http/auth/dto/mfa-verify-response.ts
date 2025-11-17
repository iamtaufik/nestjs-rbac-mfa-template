import { ApiProperty } from '@nestjs/swagger';

export class MfaVerifyResponseDto {
  @ApiProperty({
    description: 'Access Token',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh Token',
  })
  refreshToken: string;
}
