import { Exclude } from 'class-transformer';
import { Post } from 'src/posts/entities/post.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Logs } from '../../logs/logs.entity';
import { Roles } from '../../role/entities/role.entity';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  username: string;
  @Column()
  @Exclude()
  password: string;
  // cascade联合模型更新
  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;
  @OneToMany(() => Logs, (logs) => logs.user)
  logs: Logs[];
  @ManyToMany(() => Roles, (roles) => roles.users, { cascade: ['insert'] })
  @JoinTable({ name: 'user_roles' })
  roles: Roles[] | number[];

  @OneToMany(() => Post, (posts) => posts.user)
  posts: Post[];
}
