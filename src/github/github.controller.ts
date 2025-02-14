import { Controller, Get } from '@nestjs/common';
import { GithubService } from './github.service';
import { ApiOperation } from '@nestjs/swagger';
import { UseFilters, UseGuards } from '@nestjs/common';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';

@Controller('github')
@UseFilters(new TypeormFilter())
@UseGuards(JwtGuard)
@ApiTags('github')
@ApiBearerAuth()
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('/token')
  @ApiOperation({ summary: '获取token' })
  getToken() {
    return this.githubService.getToken();
  }
}
