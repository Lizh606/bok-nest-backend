/*
 * @Author: lizh
 * @Date: 2023-12-13 14:36:31
 * @LastEditors: lizh
 * @LastEditTime: 2023-12-14 10:48:14
 * @Description: 请填写简介
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';

import * as session from 'express-session';

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
  await app.listen(3000);
}
bootstrap();
