import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import type { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取请求对象
    const request = context.switchToHttp().getRequest();

    const user = (await this.userService.findByCondition({
      keyword: request.user.username,
    })) as User[];
    console.log('123', user);
    // 角色判断
    // 管理员
    const hasRole = (id) => {
      console.log(id, 'iddd');

      return id === 1 || id === 2;
    };
    if (
      user[0].roles.find((i) => {
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
