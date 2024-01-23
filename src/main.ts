/*
 * @Author: lizh
 * @Date: 2023-12-13 14:36:31
 * @LastEditors: lizh
 * @LastEditTime: 2023-12-14 10:48:14
 * @Description: 请填写简介
 */
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as session from 'express-session';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

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
  // const httpAdapter = app.get(HttpAdapterHost);
  // // 全局Filter只能有一个
  // // app.useGlobalFilters(new HttpExceptionFilter(logger));
  // app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));
  await app.listen(3000);
  // logger.log('运行中ing');
}
bootstrap();
