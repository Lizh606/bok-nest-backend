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
  Headers,
  Inject,
  // Patch,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'nestjs-pino';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { User } from './entities/user.entity';
import { CreateUserPipe } from './pipes/create-user/create-user.pipe';
import { UserService } from './user.service';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller({ path: 'user', version: '1' })
@UseFilters(new TypeormFilter())
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {
    this.logger.log('UserController initialized');
  }

  @Post()
  create(@Body(CreateUserPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto as User);
  }

  @Get()
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
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(+id);
  }

  @Post(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Headers('Authorization') headers: any,
  ) {
    console.log(headers);
    if (id === headers) {
      return this.userService.update(+id, updateUserDto);
    } else {
      throw new UnauthorizedException();
    }
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
  @UseGuards(AuthGuard('jwt'))
  getUserProfile(
    @Param('id') id: number,
    // req是AuthGuard的validate返回的
    // @Req() req,
  ): any {
    return this.userService.findProfile(id);
  }
  @Get('logs/:id')
  getUserLogs(@Param('id') id: number): any {
    return this.userService.findLogs(id);
  }
  @Get('logsByGroup/:id')
  async getUserLogsByGroup(@Param('id') id: number): Promise<any> {
    const res = await this.userService.getUserLogsByGroup(id);
    return res.map((i) => ({
      result: i.result,
      count: i.count,
    }));
  }
}
