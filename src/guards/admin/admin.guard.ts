import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取请求对象
    const request = context.switchToHttp().getRequest();

    const user = await this.userService.findByCondition({
      keyword: request.user.username,
    });
    const data = user.data;
    console.log(data);

    // 角色判断
    // 管理员
    const hasRole = (id) => {
      return id === 1 || id === 2;
    };
    if (
      data.length > 0 &&
      data[0].roles.find((i) => {
        if (typeof i !== 'number' && i.id) {
          return hasRole(i.id);
        } else {
          return hasRole(i);
        }
      })
    ) {
      return true;
    }
    return false;
  }
}
