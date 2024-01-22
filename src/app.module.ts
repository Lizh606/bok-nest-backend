/*
 * @Author: lizh
 * @Date: 2023-12-13 14:36:31
 * @LastEditors: lizh
 * @LastEditTime: 2023-12-13 15:06:45
 * @Description: 请填写简介
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import * as dotenv from 'dotenv';
// import * as config from 'config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './configuration';
import { ConfigEnum } from './enum/config.enum';
import { ResourceModule } from './resource/resource.module';
import { UserModule } from './user/user.module';
// config插件获取获取（自动合并）
// console.log(config.get('database'), config);
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Module({
  imports: [
    UserModule,
    ResourceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('production', 'development')
          .default('development'),
        DB_PORT: Joi.number().default(3306),
        DB_HOST: Joi.string().ip(),
        DB_TYPE: Joi.string().valid('mysql', 'postgres').default('mysql'),
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
      }),
      envFilePath,
      // load: [() => dotenv.config({ path: '.env' })],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ({
          type: configService.get(ConfigEnum.DB_TYPE),
          host: configService.get(ConfigEnum.DB_HOST),
          port: configService.get(ConfigEnum.DB_PORT),
          username: configService.get(ConfigEnum.DB_USERNAME),
          password: configService.get(ConfigEnum.DB_PASSWORD),
          database: configService.get(ConfigEnum.DB_DATABASE),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          // 同步本地schema和数据库
          synchronize: true,
          logging: process.env.NODE_ENV === 'development',
        }) as TypeOrmModuleOptions,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
