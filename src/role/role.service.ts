import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Roles } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const role = await this.rolesRepository.create(createRoleDto);
    return this.rolesRepository.save(role);
  }

  findAll() {
    return this.rolesRepository.find();
  }

  findOne(id: number) {
    return this.rolesRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);
    const newRole = await this.rolesRepository.merge(role, updateRoleDto);
    return this.rolesRepository.save(newRole);
  }

  remove(id: number) {
    // delete不会触发AfterRemove等方法
    return this.rolesRepository.delete(id);
  }
}
