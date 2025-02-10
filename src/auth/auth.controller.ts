import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/signin-user.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@Controller('auth')
@UseFilters(new TypeormFilter())
@ApiTags('认证')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signIn')
  @ApiOperation({ summary: '登录' })
  @ApiBody({ type: SignInUserDto })
  async signIn(@Body() dto: SignInUserDto) {
    const { username, password } = dto;
    const token = await this.authService.signIn(username, password);
    return {
      access_token: token,
    };
  }
  @Post('/signUp')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: '注册' })
  @ApiBody({ type: SignInUserDto })
  signUp(@Body() dto: SignInUserDto) {
    const { username, password } = dto;
    return this.authService.signUp(username, password);
  }
}
