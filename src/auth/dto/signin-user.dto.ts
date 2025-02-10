import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 20, {
    // $value: 当前用户传入的值
    // $property: 当前属性名
    // $target: 当前类
    // $constraint1: 最小长度 ...
    message: `用户名长度必须在$constraint1到$constraint2之间，当前传递的值是：$value`,
  })
  @ApiProperty({
    description: '用户名',
    example: '',
    required: true,
    minLength: 3,
    maxLength: 20,
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty({
    description: '密码',
    example: '',
    required: true,
    minLength: 6,
    maxLength: 20,
  })
  password: string;
}
