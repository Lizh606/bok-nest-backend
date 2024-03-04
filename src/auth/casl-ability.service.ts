import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import type { Menus } from 'src/menus/entities/menu.entity';
import { UserService } from 'src/user/user.service';
import { getEntities } from 'src/utils/common';

@Injectable()
export class CaslAbilityService {
  constructor(private userService: UserService) {}
  // 针对全局 也可以用createUser
  async forRoot(username: string) {
    const { can, build } = new AbilityBuilder(createMongoAbility);
    const user = await this.userService.find(username);
    const menuObj = {};
    user.roles.forEach((role) => {
      role.menus.forEach((menu) => {
        menuObj[menu.id] = menu;
      });
    });
    const menus = Object.values(menuObj) as Menus[];

    menus.forEach((menu) => {
      const actions = menu.acl.split(',');
      actions.forEach((action) => {
        can(action, getEntities(menu.path));
      });
    });
    // can('read', Logs);
    // cannot('update', Logs);
    const ability = build({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      detectSubjectType: (object) => object.constructor,
    });
    return ability;
  }
}
