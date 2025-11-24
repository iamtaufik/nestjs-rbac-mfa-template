import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { S3Service } from './s3.service';

@Module({
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory(config: ConfigService) {
        return new S3Client({
          region: config.get('AWS_REGION', 'us-east-1'),
          endpoint: config.get('MINIO_ENDPOINT', 'http://localhost:9000'),
          forcePathStyle: config.get('MINIO_FORCE_PATH_STYLE') === 'true',
          credentials: {
            accessKeyId: config.get('MINIO_ACCESS_KEY')!,
            secretAccessKey: config.get('MINIO_SECRET_KEY')!,
          },
        });
      },
      inject: [ConfigService],
    },
    S3Service
  ],
  exports: ['S3_CLIENT', S3Service],
})
export class S3Module {}
