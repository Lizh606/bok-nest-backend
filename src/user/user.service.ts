/*
 * @Author: lizh
 * @Date: 2023-12-13 15:07:34
 * @LastEditors: lizh
 * @LastEditTime: 2023-12-14 11:13:01
 * @Description: 请填写简介
 */
import { Injectable } from '@nestjs/common';
// import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Logs } from 'src/logs/logs.entity';
import { Roles } from 'src/role/entities/role.entity';
import { ConditionUtil } from 'src/utils/db.helper';
import * as svgCaptcha from 'svg-captcha';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}
  // Partial全部属性变成可选属性
  async create(createUserDto: Partial<User>) {
    if (!createUserDto.roles) {
      const role = await this.rolesRepository.findOne({
        where: { id: 2 },
      });
      createUserDto.roles = [role];
    }
    if (
      createUserDto.roles instanceof Array &&
      typeof createUserDto.roles[0] === 'number'
    ) {
      createUserDto.roles = await this.rolesRepository.find({
        where: {
          id: In(createUserDto.roles as Roles[]),
        },
      });
    }

    const user = await this.userRepository.create(createUserDto);
    // argon2密码加密
    user.password = await argon2.hash(user.password);

    return this.userRepository.save(user);
  }
  find(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: ['roles'],
    });
  }
  async findAll() {
    const res = await this.userRepository.find({ relations: ['posts'] });
    return res;
  }
  async findByCondition({
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
    const result = await newQuery
      .take(size)
      .skip((page - 1) * size)
      .orderBy('user.id', 'DESC')
      // getRawMany获取扁平数据，getMany获取数据包含数据结构
      .getMany();
    //暂时返回所有总数
    const total = await this.userRepository.count({});

    return {
      data: result,
      total: total,
    };
  }

  findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'roles.menus'],
    });
  }

  findUserInfo(id: number) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['roles', 'profile'],
    });
  }

  async update(id: number, updateUserDto: Partial<User>) {
    if (
      updateUserDto.roles instanceof Array &&
      typeof updateUserDto.roles[0] === 'number'
    ) {
      updateUserDto.roles = await this.rolesRepository.find({
        where: {
          id: In(updateUserDto.roles as Roles[]),
        },
      });
    }
    // 联合模型更新，需使用save或queryBuilder
    const userTemp = await this.userRepository.findOne({
      where: { id },
      relations: {
        profile: true,
        roles: true, // 连表查询出所有的的信息，如果不连表查询
      },
    });

    const newUser = this.userRepository.merge(userTemp, updateUserDto);
    // argon2密码加密
    if (updateUserDto.password) {
      newUser.password = await argon2.hash(newUser.password);
    }
    return this.userRepository.save(newUser);
    // 单模型更新，不适合关系模型
    // return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
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
  // createUser(req, body) {
  //   if (
  //     req.session.code.toLocaleLowerCase() === body?.code?.toLocaleLowerCase()
  //   ) {
  //     return {
  //       msg: '验证成功',
  //       status: 'success',
  //     };
  //   } else {
  //     return {
  //       msg: '验证失败',
  //       status: 'err',
  //     };
  //   }
  // }

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
  async changeStatus(id: number) {
    const user = await this.findOne(id);
    return this.update(id, {
      status: user.status === 1 ? 0 : 1,
    });
  }
}
