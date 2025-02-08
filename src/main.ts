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
import rateLimit from 'express-rate-limit';
import * as session from 'express-session';
import helmet from 'helmet';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllExceptionFilter } from './filters/all-exception.filter';
import { UserService } from './user/user.service';
import { UserInterceptor } from './interceptors/user.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
    cors: true,
  });
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000, // 1 minutes
      max: 300, // limit each IP to 100 requests per windowMs
    }),
  );
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
      whitelist: true, // 去除类上不存在的数据
    }),
  );

  // 全局守卫
  // app.useGlobalGuards()
  // 弊端-无法使用di-无法使用userService

  // 全局拦截器
  app.useGlobalInterceptors(new UserInterceptor(app.get(UserService)));

  await app.listen(13000);
  // logger.log('运行中ing');
}
bootstrap();
