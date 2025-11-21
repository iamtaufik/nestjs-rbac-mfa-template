import { IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionRequestDto {
  @ApiProperty({ example: 'USER_READ', description: 'Unique permission code' })
  @IsString()
  @Length(1, 100)
  code: string;

  @ApiProperty({ example: 'Read users', description: 'Human friendly name' })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description: string;
}
