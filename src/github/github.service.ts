import { Injectable } from '@nestjs/common';
import { Github } from './entities/github.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class GithubService {
  constructor(
    @InjectRepository(Github)
    private readonly githubRepository: Repository<Github>,
  ) {}

  async getToken() {
    const github = await this.githubRepository.findOne({
      where: { id: 1 },
    });
    return github.token;
  }
}
