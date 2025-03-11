import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { ConditionUtil } from 'src/utils/db.helper';
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
  async create(req, createPostDto: CreatePostDto) {
    const user = await this.userService.findOne(req.user.userId);
    const postInfo = { ...createPostDto, user };
    const post = await this.postsRepository.create(postInfo);
    return this.postsRepository.save(post);
  }

  findAll() {
    const posts = this.postsRepository.find();
    return posts;
  }

  findOne(id: number) {
    return this.postsRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });
  }

  async update(req, id: number, updatePostDto: UpdatePostDto) {
    const user = await this.userService.findOne(req.user.userId);
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

  async findByCondition({
    keyword = '',
    page = 1,
    size = 10,
    userId,
  }: {
    keyword?: string;
    page?: number;
    size?: number;
    userId?: number;
  }) {
    const obj = {
      'post.title': keyword,
    };
    const queryBuilder = this.postsRepository.createQueryBuilder('post');
    const newQuery = ConditionUtil<Post>(queryBuilder, obj);

    if (userId) {
      const { roles } = await this.userService.findOne(userId);
      const isAdmin = roles.some((role) => Number(role.id) === 1);

      if (!isAdmin) {
        newQuery.andWhere('post.userId = :userId', { userId });
      }
    }

    const result = await newQuery
      .take(size)
      .skip((page - 1) * size)
      .orderBy('post.id', 'DESC')
      .getMany();

    const total = await this.postsRepository.count({
      where: userId ? { userId } : {},
    });

    return {
      data: result,
      total: total,
    };
  }

  async statistics() {
    const total = await this.postsRepository.count({});
    const sortStatistics = await this.postsRepository
      .createQueryBuilder('post')
      .select('post.sort', 'sort')
      .addSelect('COUNT(*)', 'count')
      .groupBy('post.sort')
      .getRawMany();
    return {
      total,
      sortStatistics,
    };
  }
}
