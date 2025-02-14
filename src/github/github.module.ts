import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubController } from './github.controller';
import { Github } from './entities/github.entity';
import { GithubService } from './github.service';
@Module({
  imports: [TypeOrmModule.forFeature([Github])],
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {}
