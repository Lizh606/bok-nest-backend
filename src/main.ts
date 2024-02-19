/*
 * @Author: lizh
 * @Date: 2023-12-13 14:36:31
 * @LastEditors: lizh
 * @LastEditTime: 2023-12-14 10:48:14
 * @Description: 请填写简介
 */
import { Logger, VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common/pipes';
import * as session from 'express-session';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllExceptionFilter } from './filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(
    session({
      secret: 'HangHang',
      name: 'Hang-Session',
      rolling: true,
      cookie: { maxAge: null },
    }),
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 全局过滤
  const httpAdapter = app.get(HttpAdapterHost);
  // 全局Filter只能有一个
  // app.useGlobalFilters(new HttpExceptionFilter(logger));
  const logger = new Logger();
  app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));

  // 全局管道
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true, // 去除类上不存在的数据
    }),
  );
  await app.listen(3000);
  // logger.log('运行中ing');
}
bootstrap();
