import { Module } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { PublicationsController } from './publications.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PublicationsRepository } from './publication.repository';
import { PostsRepository } from 'src/posts/posts.repository';
import { MediasRepository } from 'src/medias/medias.repository';

@Module({
  imports: [PrismaModule],
  controllers: [PublicationsController],
  providers: [
    PublicationsService,
    PublicationsRepository,
    PostsRepository,
    MediasRepository,
  ],
  exports: [PublicationsService],
})
export class PublicationsModule {}
