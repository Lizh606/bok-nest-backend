import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import type { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    private userService: UserService,
  ) {}
  async create(createPostDto: CreatePostDto) {
    const user = await this.userService.findOne(createPostDto.userId);
    const postInfo = { ...createPostDto, user };
    const post = await this.postsRepository.create(postInfo);
    return this.postsRepository.save(post);
  }

  findAll() {
    return this.postsRepository.find();
  }

  findOne(id: number) {
    return this.postsRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const user = await this.userService.findOne(updatePostDto.userId);
    const postTemp = await this.postsRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
    const newPost = { ...updatePostDto, user };
    const newUser = this.postsRepository.merge(postTemp, newPost);

    return this.postsRepository.save(newUser);
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    return this.postsRepository.remove(post);
  }
}
