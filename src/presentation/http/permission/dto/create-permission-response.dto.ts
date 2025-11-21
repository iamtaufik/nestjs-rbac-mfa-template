import { IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'USER_READ', description: 'Unique permission code' })
  code: string;

  @ApiProperty({ example: 'Read users', description: 'Human friendly name' })
  name: string;

  @ApiProperty({ required: false })
  description?: string | null;
}
