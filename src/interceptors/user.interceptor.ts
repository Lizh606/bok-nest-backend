import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.user;

    // 将用户信息添加到 request 中
    request.userInfo = await this.userService.findOne(userId);
    const isAdmin = request.userInfo.roles.some((role) => role.id === 1);
    request.isAdmin = isAdmin;
    return next.handle();
  }
}
