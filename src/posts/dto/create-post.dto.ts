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
  content: string;
  @IsNotEmpty()
  @IsNumber()
  userId?: number;
}
