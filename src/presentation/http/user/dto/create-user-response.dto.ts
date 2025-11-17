// src/user/interface/http/dto/user.response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '31b6ad30-7e93-43a5-97c3-a49044d9f1bf' })
  id: string;

  @ApiProperty({ example: 'jhondoe' })
  username: string;

  @ApiProperty({ example: 'jhondoe@example.com' })
  email: string;

  @ApiProperty({ example: true })
  isActive: boolean;
}
