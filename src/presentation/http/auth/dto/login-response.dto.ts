import { ApiProperty } from '@nestjs/swagger';

class LoginUserDto {
  @ApiProperty({ example: 'f0c91b8a-5e3b-4d0f-9d2a-5f22e4b3f111' })
  id: string;

  @ApiProperty({ example: 'johndoe' })
  usrnm: string;

  @ApiProperty({ example: 'john@example.com' })
  emadr: string;

  // optional: kamu bisa tambahkan roles / pages nanti di sini
  // roles?: string[];
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token',
  })
  refreshToken: string;

  @ApiProperty({
    type: LoginUserDto,
  })
  user: LoginUserDto;

  @ApiProperty({
    description:
      'True kalau user punya MFA aktif dan masih perlu verifikasi MFA di step berikutnya',
    example: false,
    required: false,
  })
  mfaRequired?: boolean;
}
