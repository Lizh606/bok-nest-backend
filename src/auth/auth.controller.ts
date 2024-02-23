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

@Controller('auth')
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/signIn')
  async signIn(@Body() dto: SignInUserDto) {
    const { username, password } = dto;
    const token = await this.authService.signIn(username, password);
    return {
      access_token: token,
    };
  }
  @Post('/signUp')
  @UseInterceptors(ClassSerializerInterceptor)
  signUp(@Body() dto: SignInUserDto) {
    const { username, password } = dto;
    return this.authService.signUp(username, password);
  }
}
