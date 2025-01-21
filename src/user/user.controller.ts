/*
 * @Author: lizh
 * @Date: 2023-12-13 15:07:34
 * @LastEditors: lizh
 * @LastEditTime: 2023-12-14 11:06:10
 * @Description: 请填写简介
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  // Patch,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'nestjs-pino';
import { GetUserInfo } from 'src/decorators/user.decorator';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { AdminGuard } from 'src/guards/admin/admin.guard';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import type { User } from './entities/user.entity';
import { CreateUserPipe } from './pipes/create-user/create-user.pipe';
import { UserService } from './user.service';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller({ path: 'user', version: '1' })
@UseFilters(new TypeormFilter())
@UseGuards(JwtGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {
    this.logger.log('UserController initialized');
  }

  @Post()
  create(@Body(CreateUserPipe) createUserDto: Partial<User>) {
    return this.userService.create(createUserDto);
  }

  @Get()
  // 相同方法 从下往上执行
  // @UseGuards(AdminGuard)
  // @UseGuards(AuthGuard('jwt'))

  // 如果传递多个守卫，则从前往后,前面guard不通过，后面的guard不执行
  // @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UseGuards(AdminGuard)
  findAll() {
    return this.userService.findAll();
  }
  @Get('page')
  findByPage(
    @Query()
    query: {
      keyword: string;
      page: number;
      size: number;
      role: number;
      gender: string;
    },
  ) {
    return this.userService.findByCondition(query);
  }
  @Get('userInfo')
  findUserInfo(@GetUserInfo() user) {
    const { userId } = user;
    return this.userService.findUserInfo(+userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(+id);
  }

  @Post(':id')
  update(
    @Param('id') id: string,
    @Body(CreateUserPipe) updateUserDto: Partial<User>,
    // @Headers('Authorization') headers: any,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('code')
  createCaptcha(@Req() req, @Res() res) {
    return this.userService.createCaptcha(req, res);
  }

  @Post('create')
  createUser(@Req() req, @Body() body) {
    return this.userService.createUser(req, body);
  }
  @Get('profile/:id')
  getUserProfile(
    @Param('id') id: number,
    // req是AuthGuard的validate返回的
    // @Req() req,
  ): any {
    return this.userService.findProfile(id);
  }
}
