import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Github {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;
}
