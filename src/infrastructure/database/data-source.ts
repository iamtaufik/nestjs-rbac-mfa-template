import 'dotenv/config';
import { DataSource } from 'typeorm';
import { join } from 'path';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  entities: [
    join(__dirname, './entities/*.js'),
    join(__dirname, './entities/*.ts'),
  ],

  migrations: [join(__dirname, './migrations/*.{ts,js}')],
  synchronize: false,
  logging: false,
});
