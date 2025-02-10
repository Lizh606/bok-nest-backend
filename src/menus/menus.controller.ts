import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enum/role.enum';
import { JwtGuard } from 'src/guards/jwt/jwt.guard';
import { RolesGuard } from '../guards/roles/roles.guard';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenusService } from './menus.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
@Controller('menus')
@Roles(Role.Admin)
@UseGuards(JwtGuard, RolesGuard)
@ApiTags('菜单管理')
@ApiBearerAuth()
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post('create')
  @ApiOperation({ summary: '创建菜单' })
  @ApiBody({ type: CreateMenuDto })
  async create(@Body() createMenuDto: CreateMenuDto) {
    return await this.menusService.create(createMenuDto);
  }

  @Get('list')
  @Roles(Role.User)
  @ApiOperation({ summary: '获取所有菜单' })
  findAll() {
    return this.menusService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取菜单详情' })
  @ApiParam({ name: 'id', description: '菜单ID' })
  findOne(@Param('id') id: string) {
    return this.menusService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新菜单' })
  @ApiParam({ name: 'id', description: '菜单ID' })
  @ApiBody({ type: UpdateMenuDto })
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menusService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  @ApiParam({ name: 'id', description: '菜单ID' })
  remove(@Param('id') id: string) {
    return this.menusService.remove(+id);
  }
}
