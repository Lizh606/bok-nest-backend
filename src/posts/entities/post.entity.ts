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
  userId: number;
  @Column()
  sort: string;
  @Column()
  tag: string;
  @Column('text')
  content: string;
  @Column()
  date: string;
  @Column()
  description: string;
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn()
  user: User;
}
