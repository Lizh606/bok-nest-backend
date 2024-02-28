import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { RolesService } from './roles.service';

@Controller('roles')
@UseFilters(new TypeormFilter())
@UseGuards(JwtGuard)
export class RolesController {
  constructor(private rolesService: RolesService) {}
  @Get()
  getRoleList() {
    return this.rolesService.getRoleList();
  }
}
