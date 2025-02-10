import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '角色名称', example: '管理员' })
  name: string;
}
