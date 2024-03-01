import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
// import { Menus } from '../../menus/entities/menu.entity';
import { Menus } from '../../menus/entities/menu.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Roles {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
  @ManyToMany(() => Menus, (menus) => menus.role)
  menus: Menus;
}
