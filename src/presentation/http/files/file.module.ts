import { Module } from '@nestjs/common';
import { S3Controller } from './file.controller';
import { S3Module } from 'src/infrastructure/storage/s3.module';
import { RbacModule } from 'src/common/rbac/rbac.module';

@Module({
  imports: [S3Module, RbacModule],
  controllers: [S3Controller],
})
export class FileModule {}
