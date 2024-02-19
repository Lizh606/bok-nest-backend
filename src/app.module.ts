/*
 * @Author: lizh
 * @Date: 2023-12-13 14:36:31
 * @LastEditors: lizh
 * @LastEditTime: 2023-12-13 15:06:45
 * @Description: 请填写简介
 */
import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
// import * as config from 'config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { LoggerModule } from 'nestjs-pino';
import { connectionParams } from '../ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogsModule } from './logs/logs.module';
import { ResourceModule } from './resource/resource.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
// config插件获取获取（自动合并）
// console.log(config.get('database'), config);
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Global()
@Module({
  imports: [
    UserModule,
    ResourceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('production', 'development')
          .default('development'),
        DB_PORT: Joi.number().default(3306),
        DB_HOST: Joi.alternatives().try(
          Joi.string().ip(),
          Joi.string().domain(),
        ),
        DB_TYPE: Joi.string().valid('mysql', 'postgres').default('mysql'),
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
        LOG_LEVEL: Joi.string(),
        LOG_ON: Joi.boolean(),
      }),
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
    }),
    TypeOrmModule.forRoot(connectionParams),

    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      },
    }),
    LogsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
  exports: [Logger],
})
export class AppModule {}
