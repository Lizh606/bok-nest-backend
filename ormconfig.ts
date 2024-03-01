import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigEnum } from './src/enum/config.enum';
function getEnv(env: string): Record<string, unknown> {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }
  return {};
}
function buildConnectionOptions() {
  const defaultConfig = getEnv('.env');
  const envConfig = getEnv(`.env.${process.env.NODE_ENV || 'development'}`);
  const config = { ...defaultConfig, ...envConfig };
  const entitiesDir =
    process.env.NODE_ENV === 'test'
      ? [__dirname + '/**/*.entity.ts']
      : [__dirname + '/**/*.entity{.js,.ts}'];

  return {
    type: config[ConfigEnum.DB_TYPE],
    host: config[ConfigEnum.DB_HOST],
    port: config[ConfigEnum.DB_PORT],
    username: config[ConfigEnum.DB_USERNAME],
    password: config[ConfigEnum.DB_PASSWORD],
    database: config[ConfigEnum.DB_DATABASE],
    entities: entitiesDir,
    // 同步本地的schema与数据库 -> 初始化的时候去使用
    synchronize: true,
    logging: process.env.NODE_ENV === 'development',
  } as TypeOrmModuleOptions;
}
export const connectionParams = buildConnectionOptions();
export default new DataSource({
  ...connectionParams,
  migrations: ['src/migrations/**'],
  subscribers: [],
} as DataSourceOptions);
