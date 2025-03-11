import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    // 检查是否存在用户信息
    if (request.user && request.user.userId) {
      const { userId } = request.user;
      request.userInfo = await this.userService.findOne(userId);
      const isAdmin = request.userInfo.roles.some((role) => role.id === 1);
      request.isAdmin = isAdmin;
    }

    return next.handle();
  }
}
