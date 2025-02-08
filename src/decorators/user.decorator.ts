import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserService } from 'src/user/user.service';

export const GetUserInfo = createParamDecorator(
  async (userService: UserService, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { userId } = request.user;
    const userInfo = await userService.findOne(userId);
    return userInfo;
  },
);
