import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  sort: string;
  @IsString()
  tag: string;
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsString()
  @IsNotEmpty()
  date: string;
  @IsString()
  description: string;
  @IsNumber()
  @IsNotEmpty()
  userId?: number;
}
