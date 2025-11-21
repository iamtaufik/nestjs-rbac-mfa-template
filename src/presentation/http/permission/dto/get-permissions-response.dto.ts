import { ApiProperty } from '@nestjs/swagger';

export class GetPermissionsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}
