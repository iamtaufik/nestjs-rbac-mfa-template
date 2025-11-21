import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RbacGuard } from 'src/common/guards/rbac.guard';
import { CreatePermissionUseCase } from 'src/core/application/permission/use-case/create-permission.use-case';
import { ApiResponseDto, ApiResponseOf } from '../dto/common/api-response.dto';
import { CreatePermissionResponseDto } from './dto/create-permission-response.dto';
import { CreatePermissionRequestDto } from './dto/create-permission-request.dto';
import { GetPermissionsUseCase } from 'src/core/application/permission/use-case/get-permissions.use-case';
import { GetPermissionsResponseDto } from './dto/get-permissions-response.dto';

@ApiTags('Permission')
@UseGuards(AuthGuard, RbacGuard)
@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly createPermUseCase: CreatePermissionUseCase,
    private readonly getPermUseCase: GetPermissionsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @Permissions('PERM_CREATE')
  @ApiOperation({ summary: 'Create new permission' })
  @ApiOkResponse({
    type: ApiResponseOf(CreatePermissionResponseDto),
  })
  @ApiBearerAuth('access-token')
  async createPermission(
    @Body() body: CreatePermissionRequestDto,
  ): Promise<ApiResponseDto<CreatePermissionResponseDto>> {
    const result = await this.createPermUseCase.execute(body);

    return {
      message: 'Success create permission',
      data: result,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Permissions('PERM_VIEW')
  @ApiOperation({ summary: 'List permission' })
  @ApiBearerAuth('access-token')
  async getPermissions() {
    const result = await this.getPermUseCase.execute();

    return {
      message: 'Success retrive all permissions',
      data: result,
    };
  }
}
