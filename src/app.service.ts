import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  /**
   * 获取一个指定长度的数字范围数组
   * @param num 范围的长度
   * @returns 数字范围数组
   */
  getRange(num: string): string[] {
    const parseNum = parseInt(num);
    if (isNaN(parseNum)) {
      throw new BadRequestException('Invalid number');
    }
    return Array.from({ length: parseNum }, (_, i) => (i + 1).toString());
  }
}
