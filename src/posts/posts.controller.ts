import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { AdminGuard } from 'src/guards/admin/admin.guard';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';
@Controller('posts')
@UseFilters(new TypeormFilter())
@UseGuards(JwtGuard, AdminGuard)
@ApiTags('文章管理')
@ApiBearerAuth()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  @ApiOperation({ summary: '创建文章' })
  @ApiBody({ type: CreatePostDto })
  create(@Req() req, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(req, createPostDto);
  }

  @Get('list')
  @ApiOperation({ summary: '获取所有文章' })
  findAll(
    @Query()
    query: {
      keyword: string;
      page: number;
      size: number;
      userId?: number;
    },
    @Req() req,
  ) {
    const { userId } = req.user;
    if (query) {
      query.userId = userId;
      return this.postsService.findByCondition(query);
    }
    return this.postsService.findAll();
  }
  @Get('statistics')
  @ApiOperation({ summary: '获取统计信息' })
  statistics() {
    return this.postsService.statistics();
  }
  @Get(':id')
  @ApiOperation({ summary: '获取文章详情' })
  @ApiParam({ name: 'id', description: '文章ID' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新文章' })
  @ApiParam({ name: 'id', description: '文章ID' })
  @ApiBody({ type: UpdatePostDto })
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(req, +id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除文章' })
  @ApiParam({ name: 'id', description: '文章ID' })
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
