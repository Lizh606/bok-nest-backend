/*
 * @Author: lizh
 * @Date: 2023-12-13 15:07:34
 * @LastEditors: lizh
 * @LastEditTime: 2023-12-14 11:13:01
 * @Description: 请填写简介
 */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Logs } from 'src/logs/logs.entity';
import { ConditionUtil } from 'src/utils/db.helper';
import * as svgCaptcha from 'svg-captcha';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll() {
    const res = await this.userRepository.find();
    return res;
  }
  async findByPage({
    keyword = '',
    page = 1,
    size = 10,
    role,
    gender,
  }: {
    keyword?: string;
    page?: number;
    size?: number;
    role?: number;
    gender?: string;
  }) {
    // type QueryCondition = { [key: string]: string | number } | null;

    // interface WhereConditions {
    //   [key: string]: QueryCondition;
    // }

    // const conditionMap = new Map<string, (value: any) => QueryCondition>([
    //   ['username', (keyword) => ({ Like: `%${keyword}%` })],
    //   ['roles', (role) => ({ id: role })],
    //   ['profile', (gender) => ({ gender: gender })],
    //   // Add more fields and their processing functions...
    // ]);

    // function buildWhereConditions(
    //   ...args: [key: string, value: any][]
    // ): WhereConditions {
    //   const where: WhereConditions = {};
    //   for (const [key, value] of args) {
    //     if (conditionMap.has(key) && value !== undefined) {
    //       where[key] = conditionMap.get(key)(value);
    //     }
    //   }
    //   return where;
    // }

    // function applyQueryCondition(
    //   where: WhereConditions,
    //   queryKey: string,
    //   queryValue: any,
    // ): WhereConditions {
    //   return queryValue
    //     ? { ...where, ...buildWhereConditions([queryKey, queryValue]) }
    //     : where;
    // }

    // let where: WhereConditions = {};
    // where = applyQueryCondition(where, 'username', keyword);
    // where = applyQueryCondition(where, 'roles', role);
    // where = applyQueryCondition(where, 'profile', gender);

    // const data = await this.userRepository.find({
    //   select: {
    //     id: true,
    //     username: true,
    //     profile: {
    //       id: true,
    //       gender: true,
    //     },
    //   },
    //   where,
    //   order: { id: 'ASC' },
    //   skip: (page - 1) * size,
    //   take: size,
    //   relations: { profile: true, roles: true },
    // });

    // const total = await this.userRepository.count({ where });
    //  return {
    //    data,
    //    total,
    //  };
    //queryBuilder
    const obj = {
      'user.username': keyword,
      'profile.gender': gender,
      'roles.id': role,
    };
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles');
    const newQuery = ConditionUtil<User>(queryBuilder, obj);
    return newQuery
      .take(size)
      .skip((page - 1) * size)
      .getMany();
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
  createCaptcha(req, res) {
    const captcha = svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: '#fff', //背景颜色
    });
    req.session.code = captcha.text; //存储验证码记录到session
    res.type('image/svg+xml');
    res.send(captcha.data);
  }
  createUser(req, body) {
    if (
      req.session.code.toLocaleLowerCase() === body?.code?.toLocaleLowerCase()
    ) {
      return {
        msg: '验证成功',
        status: 'success',
      };
    } else {
      return {
        msg: '验证失败',
        status: 'err',
      };
    }
  }

  findProfile(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });
  }
  async findLogs(id: number) {
    const user = await this.findOne(id);

    return this.logsRepository.find({
      where: { user },
      // relations: {
      //   user: true,
      // },
    });
  }
  getUserLogsByGroup(id: number) {
    return (
      this.logsRepository
        .createQueryBuilder('logs')
        .select('logs.result', 'result')
        .addSelect('COUNT("logs.result")', 'count')
        .leftJoinAndSelect('logs.user', 'user')
        .where('user.id = :id', { id })
        .groupBy('logs.result')
        .addOrderBy('result', 'DESC')
        // .orderBy('result', 'DESC')
        // 分页
        // .offset(2)
        // .limit(3)
        .getRawMany()
    );
  }
}
