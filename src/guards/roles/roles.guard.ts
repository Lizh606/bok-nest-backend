import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/role.decorator';
import type { Role } from 'src/enum/role.enum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // jwt -> userId -> user -> roles
    // getAllAndMerge -> 合并 getAllAndOveride -> 读取路由上的metadata
    const requiredRoles = this.reflector.getAllAndMerge<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    // user -> roles -> menu -> CURD + M, C1,C2,C3
    const { data } = await this.userService.findByCondition({
      keyword: req.user.username,
    });

    const roleIds = data[0].roles.map((o) => o.id);

    const flag = requiredRoles.some((role) => roleIds.includes(role));
    return flag;
  }
}
