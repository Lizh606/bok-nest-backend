import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async signIn(username: string, password: string) {
    const data = await this.userService.findByCondition({ keyword: username });
    if (data[0] && data[0].password === password) {
      // 生成token
      return await this.jwtService.signAsync(
        {
          username: username,
          sub: data[0].id,
        },
        // 局部 - refreshToken
        // {
        //   expiresIn: '1d',
        // },
      );
    }
    throw new UnauthorizedException();
  }
  async signUp(username: string, password: string) {
    // if (!username || !password) {
    //   throw new HttpException('用户名或密码不存在', 400);
    // }
    const res = await this.userService.create({
      username: username,
      password: password,
    });
    return res;
  }
}
