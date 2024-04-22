import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  title: string;
  @Column()
  sort: string;
  @Column()
  tag: string;
  @Column()
  content: string;
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn()
  user: User;
}
