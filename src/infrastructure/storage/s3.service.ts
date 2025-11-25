import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Upload } from '@aws-sdk/lib-storage';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private bucket: string;

  constructor(
    @Inject('S3_CLIENT')
    private readonly client: S3Client,
    private readonly config: ConfigService,
  ) {
    this.bucket = this.config.get('MINIO_BUCKET', 'uploads');
  }

  async uploadStream(
    stream: Readable,
    key: string,
    contentType = 'application/octet-stream',
  ) {
    // const nodeStream = this._toNodeReadable(stream);
    const parallelUploads3 = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: stream,
        ContentType: contentType,
      },
      queueSize: 4, // concurrency
      partSize: 5 * 1024 * 1024, // 5MB part
    });

    try {
      const result = await parallelUploads3.done();
      // result will contain ETag, etc depending on the service
      return { key, etag: (result as any).ETag };
    } catch (err) {
      this.logger.error('uploadStream error', err);
      throw err;
    }
  }

  // small file / buffer upload
  async uploadBuffer(
    buffer: Buffer,
    key: string,
    contentType = 'application/octet-stream',
  ) {
    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });
    const res = await this.client.send(cmd);
    return { key, etag: (res as any).ETag };
  }

  async getPresignedGetUrl(key: string, expiresSeconds = 60 * 5) {
    const cmd = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.client, cmd, { expiresIn: expiresSeconds });
  }

  // presigned PUT URL for direct client upload (note: no content-type enforcement here)
  async getPresignedPutUrl(key: string, expiresSeconds = 60 * 5) {
    const putCmd = new PutObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.client, putCmd, { expiresIn: expiresSeconds });
  }

  async remove(key: string) {
    const cmd = new DeleteObjectCommand({ Bucket: this.bucket, Key: key });
    await this.client.send(cmd);
  }
}
