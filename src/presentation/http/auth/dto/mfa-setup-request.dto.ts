import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MfaSetupRequestDto {
  @ApiProperty({
    description: 'user id',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
