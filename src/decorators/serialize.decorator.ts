import { UseInterceptors } from '@nestjs/common';
import { SerializeInterceptor } from 'src/interceotors/serialize/serialize.interceptor';

interface ClassConstructor {
  new (...args: any[]): any;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
