import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RbacGuard } from 'src/common/guards/rbac.guard';
import { GetRolesUseCase } from 'src/core/application/role/use-case/get-roles.use-case';
import { ApiResponseDto, ApiResponseOf } from '../dto/common/api-response.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { DetailRoleUseCase } from 'src/core/application/role/use-case/detail-role.use-case';

@ApiTags('Role Management')
@ApiExtraModels(ApiResponseDto, RoleResponseDto)
@Controller('roles')
export class RoleController {
    constructor(
        private readonly getRoleUseCase: GetRolesUseCase,
        private readonly getDetailRoleUseCase: DetailRoleUseCase
    ) {}
    
    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard, RbacGuard)
  @ApiOperation({ summary: 'List roles' })
  @Permissions('ROLE_VIEW')
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    type: ApiResponseOf(RoleResponseDto),
  })
  async getRoles(
    @Request() request,
  ): Promise<ApiResponseDto<RoleResponseDto[]>> {
    const roles = await this.getRoleUseCase.execute();

    return {
      message: 'Success get roles',
      data: roles,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
//   @ApiBearerAuth('access-token')
  async getRoleDetail(@Param('id') id: string) {
    const role = await this.getDetailRoleUseCase.execute(id)

    return role
  }
}
