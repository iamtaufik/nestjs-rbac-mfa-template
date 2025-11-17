import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UserResponseDto } from './dto/create-user-response.dto';
import { CreateUserUseCase } from 'src/core/application/user/use-case/create-user.use-case';
import { ApiResponseDto, ApiResponseOf } from '../dto/common/api-response.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('User Management')
@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user (User Management)' })
  @ApiCreatedResponse({
    type: ApiResponseOf(UserResponseDto),
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  // @UseGuards(JwtAuthGuard, new RbacGuard(['USER_CREATE'])) // nanti kalau guard RBAC sudah siap
  async create(
    @Body() body: CreateUserRequestDto,
  ): Promise<ApiResponseDto<UserResponseDto>> {
    const user = await this.createUserUseCase.execute({
      username: body.username,
      email: body.email,
      password: body.password,
      isActive: body.isActive ?? true,
    });

    const response: UserResponseDto = {
      id: user.id,
      username: user.username,
      email: user.email,
      isActive: user.isActive,
    };

    return {
      message: 'Success create user',
      data: response,
    };
  }
}
