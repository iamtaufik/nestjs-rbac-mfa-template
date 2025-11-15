import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { BaseResponseDto } from '../dto/common/base-response.dto';
import { ApiResponseOf } from '../dto/common/api-response.dto';

import { RegisterUserUseCase } from 'src/core/application/auth/use-case/register-user.use-case';
import { LoginUserUseCase } from 'src/core/application/auth/use-case/login-user.use-case';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    type: BaseResponseDto<RegisterResponseDto>,
  })
  async register(
    @Body() dto: RegisterRequestDto,
  ): Promise<BaseResponseDto<RegisterResponseDto>> {
    const result = await this.registerUserUseCase.execute({
      username: dto.username,
      email: dto.email,
      password: dto.password,
    });

    return {
      message: 'Success create user',
      data: result,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Login success',
    type: ApiResponseOf(LoginResponseDto),
  })
  async login(
    @Body() body: LoginRequestDto,
  ): Promise<{ message: string; data: LoginResponseDto }> {
    const result = await this.loginUserUseCase.execute(body);

    return {
      message: 'Success login',
      data: result,
    };
  }
}
