import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '菜单名称', example: '菜单名称' })
  name: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '菜单路径', example: '菜单路径' })
  path: string;
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '排序', example: 1 })
  order: number;
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '权限', example: '权限' })
  acl: string;
}
