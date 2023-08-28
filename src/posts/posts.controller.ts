import { Controller, Get, Post, Body, Patch, HttpCode } from '@nestjs/common';
import { Delete, Param } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/')
  @HttpCode(201)
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get('/')
  @HttpCode(200)
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: number) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(202)
  update(@Param('id') id: number, @Body() data: CreatePostDto) {
    return this.postsService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(202)
  remove(@Param('id') id: number) {
    return this.postsService.remove(id);
  }
}
