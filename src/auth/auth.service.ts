import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async signIn(username: string, password: string) {
    try {
      const result = await this.userService.findByCondition({
        keyword: username,
      });

      const users = Array.isArray(result.data) ? result.data : [];

      if (users.length === 0) {
        throw new ForbiddenException('用户不存在呢');
      }

      const user = users[0];
      const isPasswordValid = await argon2.verify(user.password, password);

      if (!isPasswordValid) {
        throw new ForbiddenException('用户名或密码错误');
      }

      return await this.jwtService.signAsync({
        username: username,
        sub: user.id,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new ForbiddenException('登录失败，请稍后重试');
    }
  }
  async signUp(username: string, password: string) {
    const data = await this.userService.findByCondition({ keyword: username });
    if (data[0]) {
      throw new ForbiddenException('用户已存在呢');
    }
    const res = await this.userService.create({
      username: username,
      password: password,
    });
    return res;
  }
}
