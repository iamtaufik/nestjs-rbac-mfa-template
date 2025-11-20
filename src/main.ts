import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

process.env.TZ = 'UTC';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'mfa-ticket',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'refresh-token',
    )
    .setTitle('Minimal RBAC Authentication')
    .setDescription('API documentation for Auth + RBAC + MFA')
    .setVersion('1.0.0')
    .build();

  app.setGlobalPrefix('api');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // hapus field yang tidak ada di DTO (contoh: "awok")
      forbidNonWhitelisted: true, // kalau ada field asing -> langsung error
      transform: true, // body plain object -> instance dari DTO
      exceptionFactory(validationErrors) {
        const errors = validationErrors.map((err) => ({
          field: err.property,
          constraints: Object.values(err.constraints || {}),
        }));

        return new BadRequestException({
          message: 'Validation failed',
          errors,
        });
      },
    }),
  );
  app.enableCors({
    origin: '*', // Replace with your actual frontend domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
