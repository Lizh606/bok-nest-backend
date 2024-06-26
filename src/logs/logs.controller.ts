import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Can, CheckPoliciesHandler } from 'src/decorators/casl.decorator';
import { Serialize } from 'src/decorators/serialize.decorator';
import { Action } from 'src/enum/action.enum';
import { AdminGuard } from 'src/guards/admin/admin.guard';
import { CaslGuard } from 'src/guards/casl/casl.guard';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { UserService } from 'src/user/user.service';
import { Logs } from './logs.entity';
class LogsDto {
  @IsString()
  @IsNotEmpty()
  msg: string;

  @IsString()
  id: string;

  @IsString()
  name: string;
}

class PublicLogsDto {
  @Expose()
  msg: string;

  @Expose()
  name: string;
}

@Controller('logs')
@UseGuards(JwtGuard, AdminGuard, CaslGuard)
@CheckPoliciesHandler((ability) => ability.can(Action.Read, Logs))
@Can(Action.Read, Logs)
export class LogsController {
  constructor(private userService: UserService) {}
  @Get(':id')
  @Can(Action.Update, Logs)
  getUserLogs(@Param('id') id: number): any {
    return this.userService.findLogs(id);
  }
  @Get('logsByGroup/:id')
  async getUserLogsByGroup(@Param('id') id: number): Promise<any> {
    const res = await this.userService.getUserLogsByGroup(id);
    return res.map((i) => ({
      result: i.result,
      count: i.count,
    }));
  }

  @Post()
  @Serialize(PublicLogsDto)
  // @UseInterceptors(new SerializeInterceptor(PublicLogsDto))
  postTest(@Body() dto: LogsDto) {
    console.log(
      '🚀 ~ file: logs.controller.ts ~ line 15 ~ LogsController ~ postTest ~ dto',
      dto,
    );
    return dto;
  }
}
