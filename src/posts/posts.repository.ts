import { CreatePostDto } from './dto/create-post.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(data: CreatePostDto) {
    await this.prisma.post.create({ data: data });
  }

  async readPosts() {
    const posts = await this.prisma.post.findMany({});
    return posts;
  }

  async readPostId(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: Number(id) },
    });
    return post;
  }

  async updatePostId(id: number, data: CreatePostDto) {
    await this.prisma.post.update({
      where: { id: Number(id) },
      data: { title: data.title, text: data.text, image: data.image },
    });
  }

  async deletePostId(id: number) {
    await this.prisma.post.delete({ where: { id: Number(id) } });
  }
}
