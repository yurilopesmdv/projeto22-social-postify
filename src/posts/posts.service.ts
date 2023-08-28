import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsRepository } from './posts.repository';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}
  async create(data: CreatePostDto) {
    if (!data.title || !data.text)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    await this.postsRepository.createPost(data);
  }

  async findAll() {
    return await this.postsRepository.readPosts();
  }

  async findOne(id: number) {
    const post = await this.postsRepository.readPostId(+id);
    if (!post) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return post;
  }

  async update(id: number, data: CreatePostDto) {
    if (!data.title || !data.text)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    const postExists = await this.postsRepository.readPostId(+id);
    if (!postExists) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const post = await this.postsRepository.updatePostId(+id, data);
    return post;
  }

  async remove(id: number) {
    const postExists = await this.postsRepository.readPostId(+id);
    if (!postExists) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return await this.postsRepository.deletePostId(+id);
  }
}
