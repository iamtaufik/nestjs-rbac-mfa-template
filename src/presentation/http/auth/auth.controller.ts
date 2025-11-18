import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthGuard } from '../../../common/guards/auth.guard';

import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { MfaSetupRequestDto } from './dto/mfa-setup-request.dto';
import { MfaVerifyRequestDto } from './dto/mfa-verify-request.dto';
import { BaseResponseDto } from '../dto/common/base-response.dto';
import { ApiResponseDto, ApiResponseOf } from '../dto/common/api-response.dto';

import { RegisterUserUseCase } from 'src/core/application/auth/use-cases/register-user.use-case';
import { LoginUserUseCase } from 'src/core/application/auth/use-cases/login-user.use-case';
import { MfaSetupUseCase } from 'src/core/application/auth/use-cases/mfa-setup.use-case';
import { MfaVerifyUseCase } from 'src/core/application/auth/use-cases/mfa-verify.use-case';
import { MfaVerifyResponseDto } from './dto/mfa-verify-response';
import { MeUseCase } from 'src/core/application/auth/use-cases/me.use-case';
import { MeResponseDto } from './dto/me-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly mfaSetupUseCase: MfaSetupUseCase,
    private readonly mfaVerifyUseCase: MfaVerifyUseCase,
    private readonly meUseCase: MeUseCase
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({
    type: ApiResponseOf(RegisterResponseDto),
  })
  async register(
    @Body() dto: RegisterRequestDto,
  ): Promise<ApiResponseDto<RegisterResponseDto>> {
    console.log(dto);
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
  ): Promise<ApiResponseDto<LoginResponseDto>> {
    const result = await this.loginUserUseCase.execute(body);

    return {
      message: 'Success login',
      data: result,
    };
  }

  @Post('mfa/setup')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('mfa-ticket')
  async setup(@Request() request) {
    const data = await this.mfaSetupUseCase.execute(request.user.id);
    return {
      message: 'Scan QR Code to setup MFA',
      data,
    };
  }

  @Post('mfa/verify')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('mfa-ticket')
  @ApiOkResponse({
    type: ApiResponseOf(MfaVerifyResponseDto),
  })
  async verify(
    @Body() body: MfaVerifyRequestDto,
    @Request() request,
  ): Promise<ApiResponseDto<MfaVerifyResponseDto>> {
    console.log('request user', request.user);
    const data = await this.mfaVerifyUseCase.execute(
      request.user.id,
      body.token,
    );
    return {
      message: 'Successfuly Login',
      data: data,
    };
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOkResponse({
    type: ApiResponseOf(MeResponseDto)
  })
  async me(@Request() request): Promise<ApiResponseDto<MeResponseDto>> {
    const result = await this.meUseCase.execute(request.user.id)
    
    return {
      message: 'Successfuly get Me',
      data: result
    }
  }
}
