/*
 * @Author: lizh
 * @Date: 2023-12-14 09:37:44
 * @LastEditors: lizh
 * @LastEditTime: 2023-12-14 10:12:30
 * @Description: 请填写简介
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { ResourceService } from './resource.service';

@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  create(@Body('name') body) {
    return this.resourceService.create(body);
  }

  @Get()
  findAll(@Query() query) {
    return this.resourceService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resourceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return this.resourceService.update(+id, updateResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resourceService.remove(+id);
  }
}
