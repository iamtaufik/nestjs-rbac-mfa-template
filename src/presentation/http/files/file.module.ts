import { Module } from "@nestjs/common";
import { S3Controller } from "./file.controller";
import { S3Module } from "src/infrastructure/storage/s3.module";

@Module({
    imports: [S3Module],
    controllers: [S3Controller],
})
export class FileModule {}