import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { PublicationsRepository } from './publication.repository';
import { PostsRepository } from 'src/posts/posts.repository';
import { MediasRepository } from 'src/medias/medias.repository';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly publicationsRepository: PublicationsRepository,
    private readonly postRepository: PostsRepository,
    private readonly mediasRepository: MediasRepository,
  ) {}

  async create(data: CreatePublicationDto) {
    if (!data.mediaId || !data.postId || !data.date)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    const mediaExists = await this.mediasRepository.readMediaId(data.mediaId);
    if (!mediaExists)
      throw new HttpException('Media Not Found', HttpStatus.NOT_FOUND);
    const postExists = await this.postRepository.readPostId(data.postId);
    if (!postExists)
      throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND);
    await this.publicationsRepository.createPublication(data);
  }

  async findAll(query?: { published?: boolean; after?: string }) {
    const publications = await this.publicationsRepository.readPublications();
    if (query.published && query.after) {
      const published = [];
      publications.map((p) => {
        if (Date.parse(p.date) > Date.parse(query.after)) {
          published.push(p);
        }
      });
      return published;
    }
    return publications;
  }

  async findOne(id: number) {
    const publication = await this.publicationsRepository.readPublicationId(id);
    if (!publication)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return publication;
  }

  async update(id: number, data: CreatePublicationDto) {
    const publicationExists =
      await this.publicationsRepository.readPublicationId(id);
    if (!publicationExists)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const mediaExists = await this.mediasRepository.readMediaId(data.mediaId);
    if (!mediaExists)
      throw new HttpException('Media Not Found', HttpStatus.NOT_FOUND);
    const postExists = await this.postRepository.readPostId(data.postId);
    if (!postExists)
      throw new HttpException('Post Not Found', HttpStatus.NOT_FOUND);
    if (Date.parse(publicationExists.date) < Date.now())
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    if (Date.parse(data.date) < Date.now())
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    const publication = await this.publicationsRepository.updatePublicationId(
      id,
      data,
    );
    return publication;
  }

  async remove(id: number) {
    const publicationExists =
      await this.publicationsRepository.readPublicationId(id);
    if (!publicationExists)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return this.publicationsRepository.deletePublicationId(Number(id));
  }
}
