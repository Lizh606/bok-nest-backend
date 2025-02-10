import { ApiProperty } from '@nestjs/swagger';

export class PageQueryDto {
  @ApiProperty({ description: '名称', required: false, type: 'string' })
  keyword?: string;

  @ApiProperty({ description: '页码', required: true, type: 'number' })
  page: number;

  @ApiProperty({ description: '每页数量', required: true, type: 'number' })
  size: number;

  @ApiProperty({ description: '角色', required: false, type: 'number' })
  role?: number;

  @ApiProperty({ description: '性别', required: false, type: 'string' })
  gender?: string;
}
