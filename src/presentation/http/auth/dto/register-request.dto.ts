import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, isEmail } from 'class-validator';

export class RegisterRequestDto {
  @ApiProperty({ example: 'jhondoe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'jhondoe@example.com' })
  @IsString()
  @IsNotEmpty()
  @IsEmail(
    {},
    {
      message: 'email must be valid email',
    },
  )
  email: string;

  @ApiProperty({ example: 'P@ssw0rd123', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  password: string;
}
