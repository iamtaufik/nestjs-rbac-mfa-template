import { ApiProperty } from '@nestjs/swagger';

export class RegisterRequestDto {
  @ApiProperty({ example: 'jhondoe' })
  username: string;

  @ApiProperty({ example: 'jhondoe@example.com' })
  email: string;

  @ApiProperty({ example: 'P@ssw0rd123', minLength: 8 })
  password: string;
}
