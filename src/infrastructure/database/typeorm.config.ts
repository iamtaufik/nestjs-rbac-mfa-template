import 'dotenv/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  entities: [
    join(__dirname, './entities/*.js'), // sesuai strkutur folder entitiy db
    join(__dirname, './entities/*.ts'),
  ],

  synchronize: process.env.DB_SYNC === 'true',
  logging: process.env.DB_LOGGING === 'true',

  migrations: [join(__dirname, './migrations/*.{ts,js}')],
  migrationsRun: true,
};
