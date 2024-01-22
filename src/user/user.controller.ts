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
  // Patch,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @Get('page')
  findByPage(@Query() query: { keyword: string; page: number; size: number }) {
    return this.userService.findByPage(query);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
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
  getUserProfile(@Param('id') id: number): any {
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
