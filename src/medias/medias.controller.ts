import { Controller, Get, Post, HttpCode, Body, Param } from '@nestjs/common';
import { Patch, Delete } from '@nestjs/common';
import { MediasService } from './medias.service';
import { CreateMediaDto } from './dto/create-media.dto';

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Post('/')
  @HttpCode(201)
  create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediasService.create(createMediaDto);
  }

  @Get('/')
  @HttpCode(200)
  findAll() {
    return this.mediasService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: string) {
    return this.mediasService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(202)
  update(@Param('id') id: string, @Body() data: CreateMediaDto) {
    return this.mediasService.update(+id, data);
  }

  @Delete(':id')
  @HttpCode(202)
  remove(@Param('id') id: string) {
    return this.mediasService.remove(+id);
  }
}
