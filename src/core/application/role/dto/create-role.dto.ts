export class CreateRoleDto {
  code: string;
  name: string;
  description?: string | null;
  isActive?: boolean = true;
}
