import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menus } from './entities/menu.entity';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';

@Module({
  imports: [TypeOrmModule.forFeature([Menus])],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}
