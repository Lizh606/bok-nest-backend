import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '标题', example: '标题' })
  title: string;
  @IsString()
  @ApiProperty({ description: '分类', example: '分类' })
  sort: string;
  @IsString()
  @ApiProperty({ description: '标签', example: '标签' })
  tag: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '内容', example: '内容' })
  content: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '发布日期', example: '发布日期' })
  date: string;
  @IsString()
  @ApiProperty({ description: '描述', example: '描述' })
  description: string;
  // @IsNumber()
  // @IsNotEmpty()
  @ApiProperty({ description: '用户ID', example: 1, required: false })
  userId?: number;
}
