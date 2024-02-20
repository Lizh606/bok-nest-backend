import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin/admin.guard';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { UserService } from 'src/user/user.service';

@Controller('logs')
@UseGuards(JwtGuard, AdminGuard)
export class LogsController {
  constructor(private userService: UserService) {}
  @Get(':id')
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
}
