import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    description: 'Username atau email',
    example: 'johndoe',
  })
  @IsString()
  @IsNotEmpty()
  usernameOrEmail: string;

  @ApiProperty({
    description: 'Password user (plain text, akan di-verify dengan hash di DB)',
    example: 'P@ssw0rd!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
