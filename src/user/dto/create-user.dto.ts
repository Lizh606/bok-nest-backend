import { IsNotEmpty, IsString, Length } from 'class-validator';
import type { RoleService } from 'src/role/role.service';
import { Profile } from '../entities/profile.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProfileDto } from './profile.dto';

export class CreateUserDto {
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
    required: true,
    minLength: 6,
    maxLength: 20,
  })
  password: string;
  @ApiProperty({
    description: '用户信息',
    type: ProfileDto,
    required: false,
  })
  profile?: Profile;
  @ApiProperty({
    description: '角色',
    type: [Number],
    required: false,
  })
  roles?: RoleService[] | number[];
}
