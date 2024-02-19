import { Logs } from 'src/logs/logs.entity';
import { Roles } from 'src/roles/roles.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  username: string;
  @Column()
  password: string;
  // cascade联合模型更新
  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;
  @OneToMany(() => Logs, (logs) => logs.user)
  logs: Logs[];
  @ManyToMany(() => Roles, (roles) => roles.users, { cascade: ['insert'] })
  @JoinTable({ name: 'user_roles' })
  roles: Roles[] | number[];
}
