export class MeMenuDto {
  id: string;
  code: string;
  name: string;
  url: string;
  icon?: string | null;
  order: number;
  parentId?: string | null;

  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export class MePermissionDto {
  id: string;
  code: string;
  name: string;
  pageId?: string | null;
  pageCode?: string | null;
}

export class MeRoleDto {
  id: string;
  code: string;
  name: string;
  pages: MeMenuDto[];
  permissions: MePermissionDto[];
}

export class MeDto {
  id: string;
  username: string;
  email: string;
  roles: MeRoleDto[];
}
