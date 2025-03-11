/*
 * @Author: lizh
 * @Date: 2023-12-13 14:36:31
 * @LastEditors: lizh
 * @LastEditTime: 2023-12-14 09:34:26
 * @Description: 请填写简介
 */
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
@Controller()
@ApiTags('公共测试接口')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Hello World' })
  getHello() {
    return this.appService.getHello();
  }
  @Get('/range')
  @ApiOperation({ summary: '获取一个指定长度的数字范围数组' })
  getRange(@Query('num') num: string): string[] {
    return this.appService.getRange(num);
  }
  @Get('/test')
  @ApiOperation({ summary: '测试接口' })
  getTest() {
    return 'test';
  }
}
