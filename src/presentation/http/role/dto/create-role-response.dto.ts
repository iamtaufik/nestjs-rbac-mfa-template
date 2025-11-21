import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleResponseDto {
  @ApiProperty({ description: 'Id role' })
  id: string;

  @ApiProperty({ description: 'Unique role code', example: 'ADMIN' })
  code: string;

  @ApiProperty({ description: 'Role display name', example: 'Administrator' })
  name: string;

  @ApiProperty({
    description: 'Optional description for the role',
    required: false,
  })
  description?: string | null;

  @ApiProperty({
    description: 'Whether the role is active',
    required: false,
    example: true,
  })
  isActive?: boolean = true;
}
