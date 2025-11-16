import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MfaVerifyRequestDto {
  @ApiProperty({
    description: 'user id',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
