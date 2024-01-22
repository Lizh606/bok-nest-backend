/*
 * @Author: lizh
 * @Date: 2023-12-13 14:36:31
 * @LastEditors: lizh
 * @LastEditTime: 2023-12-14 09:34:26
 * @Description: 请填写简介
 */
import { Controller, Get, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { ConfigEnum } from './enum/config.enum';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello() {
    console.log(this.configService.get('db'));
    console.log(this.configService.get(ConfigEnum.DB));
    console.log(this.configService.get(ConfigEnum.COMMON));
    return this.appService.getHello();
  }
  @Get('/range')
  getRange(@Query('num') num: string): string[] {
    return this.appService.getRange(num);
  }
}