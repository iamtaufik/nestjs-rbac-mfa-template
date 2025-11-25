import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/infrastructure/storage/s3.service';
import type { Express } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('files')
@UseGuards(AuthGuard)
@Controller('files')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Upload single file to S3/MinIO' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const bucket = 'my-bucket';
    const key = `uploads/${Date.now()}-${file.originalname}`;

    const result = await this.s3Service.uploadBuffer(file.buffer, key);

    return {
      message: 'Upload success',
      data: result,
    };
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get presigned url for file' })
  @ApiResponse({
    status: 200,
    description: 'Presigned URL generated successfully',
  })
  async getPresignedUrl(@Query('key') key: string) {
    const url = await this.s3Service.getPresignedGetUrl(key, 3600); // URL valid for 1 hour
    return {
      message: 'Presigned URL generated successfully',
      data: { url },
    };
  }
}
