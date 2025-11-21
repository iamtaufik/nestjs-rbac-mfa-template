import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleRequestDto {
  @ApiProperty({ description: 'Unique role code', example: 'ADMIN' })
  @IsString()
  @Length(1, 50)
  code: string;

  @ApiProperty({ description: 'Role display name', example: 'Administrator' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Optional description for the role',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description: string;

  @ApiProperty({
    description: 'Whether the role is active',
    required: false,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
