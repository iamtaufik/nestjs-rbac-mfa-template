import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/infrastructure/storage/s3.service';
import type {Express} from 'express'
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags, } from '@nestjs/swagger';

@ApiTags('files')
@Controller('files')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
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

    const result = await this.s3Service.uploadBuffer(
        file.buffer,
      key,
    );

    return {
      message: 'Upload success',
    data: result,
    };
  }
}
