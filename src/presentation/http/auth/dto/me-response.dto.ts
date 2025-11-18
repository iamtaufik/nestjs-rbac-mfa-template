import { ApiProperty } from '@nestjs/swagger';

export class MeMenuDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  @ApiProperty({ required: false, nullable: true })
  icon?: string | null;

  @ApiProperty()
  order: number;

  @ApiProperty({ required: false, nullable: true })
  parentId?: string | null;

  @ApiProperty()
  canView: boolean;

  @ApiProperty()
  canCreate: boolean;

  @ApiProperty()
  canUpdate: boolean;

  @ApiProperty()
  canDelete: boolean;
}

export class MePermissionDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  pageId?: string | null;

  @ApiProperty({ required: false, nullable: true })
  pageCode?: string | null;
}

export class MeRoleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: () => [MeMenuDto] })
  pages: MeMenuDto[];

  @ApiProperty({ type: () => [MePermissionDto] })
  permissions: MePermissionDto[];
}

export class MeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: () => [MeRoleDto] })
  roles: MeRoleDto[];
}
