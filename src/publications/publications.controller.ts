import { Controller, Get, Post, Body } from '@nestjs/common';
import { HttpCode, Query, Patch } from '@nestjs/common';
import { Param, Delete } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post('/')
  @HttpCode(201)
  create(@Body() createPublicationDto: CreatePublicationDto) {
    return this.publicationsService.create(createPublicationDto);
  }

  @Get('/')
  @HttpCode(200)
  findAll(@Query() query?: { published?: boolean; after?: string }) {
    return this.publicationsService.findAll(query);
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: number) {
    return this.publicationsService.findOne(Number(id));
  }

  @Patch(':id')
  @HttpCode(204)
  update(@Param('id') id: number, @Body() data: CreatePublicationDto) {
    return this.publicationsService.update(Number(id), data);
  }

  @Delete(':id')
  @HttpCode(202)
  remove(@Param('id') id: number) {
    return this.publicationsService.remove(Number(id));
  }
}
