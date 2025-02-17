import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { GithubService } from './github.service';

@Controller('github')
@UseFilters(new TypeormFilter())
@UseGuards(JwtGuard)
@ApiTags('github')
@ApiBearerAuth()
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('/token')
  @ApiOperation({ summary: '获取token' })
  async getToken() {
    const token = await this.githubService.getToken();
    return {
      code: 200,
      data: token,
      message: '获取成功',
    };
  }
}
