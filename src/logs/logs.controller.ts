import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
// import { Can, CheckPoliciesHandler } from 'src/decorators/casl.decorator';
import { Serialize } from 'src/decorators/serialize.decorator';
// import { Action } from 'src/enum/action.enum';
import { AdminGuard } from 'src/guards/admin/admin.guard';
// import { CaslGuard } from 'src/guards/casl/casl.guard';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { UserService } from 'src/user/user.service';
// import { Logs } from './logs.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
class LogsDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '消息', example: '消息' })
  msg: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID', example: 'ID' })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '名称', example: '名称' })
  name: string;
}

class PublicLogsDto {
  @Expose()
  msg: string;

  @Expose()
  name: string;
}

@Controller('logs')
@UseGuards(JwtGuard, AdminGuard)
// @CheckPoliciesHandler((ability) => ability.can(Action.Read, Logs))
// @Can(Action.Read, Logs)
@ApiTags('日志管理')
@ApiBearerAuth()
export class LogsController {
  constructor(private userService: UserService) {}
  @Get(':id')
  // @Can(Action.Update, Logs)
  @ApiOperation({ summary: '获取用户日志' })
  @ApiParam({ name: 'id', description: '用户ID' })
  getUserLogs(@Param('id') id: number): any {
    console.log(id);
    return this.userService.findLogs(id);
  }
  @Get('logsByGroup/:id')
  @ApiOperation({ summary: '获取用户日志分组' })
  @ApiParam({ name: 'id', description: '用户ID' })
  async getUserLogsByGroup(@Param('id') id: number): Promise<any> {
    const res = await this.userService.getUserLogsByGroup(id);
    return res.map((i) => ({
      result: i.result,
      count: i.count,
    }));
  }

  @Post()
  @Serialize(PublicLogsDto)
  @ApiOperation({ summary: '测试日志' })
  @ApiBody({ type: LogsDto })

  // @UseInterceptors(new SerializeInterceptor(PublicLogsDto))
  postTest(@Body() dto: LogsDto) {
    console.log(
      '🚀 ~ file: logs.controller.ts ~ line 15 ~ LogsController ~ postTest ~ dto',
      dto,
    );
    return dto;
  }
}
