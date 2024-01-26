/*
 * @Author: lizh
 * @Date: 2023-12-14 09:37:44
 * @LastEditors: lizh
 * @LastEditTime: 2023-12-14 10:13:54
 * @Description: 请填写简介
 */
import { Injectable } from '@nestjs/common';
// import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ResourceService {
  create(body) {
    return {
      code: 200,
      data: body,
    };
  }

  findAll(query) {
    return {
      code: 200,
      data: query,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} resource`;
  }

  update(id: number, updateResourceDto: UpdateResourceDto) {
    return {
      newInfo: updateResourceDto,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} resource`;
  }
}
