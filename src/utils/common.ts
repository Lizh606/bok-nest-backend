import { Role } from 'src/enum/role.enum';
import { Logs } from 'src/logs/logs.entity';
import { Menus } from 'src/menus/entities/menu.entity';
import { User } from 'src/user/entities/user.entity';

export const getEntities = (path: string) => {
  const map = {
    '/user': User,
    '/logs': Logs,
    '/role': Role,
    '/auth': 'Auth',
    '/menus': Menus,
  };
  return map[path];
};
