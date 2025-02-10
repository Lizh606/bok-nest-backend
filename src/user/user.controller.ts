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
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { AdminGuard } from 'src/guards/admin/admin.guard';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { User } from './entities/user.entity';
import { CreateUserPipe } from './pipes/create-user/create-user.pipe';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { PageQueryDto } from './dto/page-query.dto';
@Controller({ path: 'user', version: '1' })
@UseFilters(new TypeormFilter())
@UseGuards(JwtGuard)
@ApiTags('用户管理')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {
    this.logger.log('UserController initialized');
  }

  @Post('create')
  @ApiOperation({ summary: '创建用户' })
  @ApiBody({ type: CreateUserDto })
  create(@Body(CreateUserPipe) createUserDto: Partial<User>) {
    return this.userService.create(createUserDto);
  }

  @Get('list')
  @ApiOperation({ summary: '获取用户列表' })
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
  @ApiOperation({ summary: '根据条件分页获取用户' })
  @ApiQuery({ type: PageQueryDto })
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
  @ApiOperation({ summary: '根据token获取用户信息' })
  findUserInfo(@Req() req) {
    const { userId } = req.user;
    return this.userService.findUserInfo(+userId);
  }

  @Get(':id')
  @ApiOperation({ summary: '根据id获取用户信息' })
  @ApiParam({ name: 'id', description: '用户id', required: true })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(+id);
  }

  @Post(':id')
  @ApiOperation({ summary: '更新用户' })
  @ApiParam({ name: 'id', description: '用户id', required: true })
  @ApiBody({ type: UpdateUserDto })
  update(
    @Param('id') id: string,
    @Body(CreateUserPipe) updateUserDto: Partial<User>,
    // @Headers('Authorization') headers: any,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  @ApiParam({ name: 'id', description: '用户id', required: true })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('code')
  @ApiOperation({ summary: '创建验证码' })
  createCaptcha(@Req() req, @Res() res) {
    return this.userService.createCaptcha(req, res);
  }

  // @Post('create')
  // @ApiOperation({ summary: '创建用户' })
  // createUser(@Req() req, @Body() body) {
  //   return this.userService.createUser(req, body);
  // }
  @Get('profile/:id')
  @ApiOperation({ summary: '获取用户信息Profile' })
  @ApiParam({ name: 'id', description: '用户id', required: true })
  getUserProfile(
    @Param('id') id: number,
    // req是AuthGuard的validate返回的
    // @Req() req,
  ): any {
    return this.userService.findProfile(id);
  }
}
