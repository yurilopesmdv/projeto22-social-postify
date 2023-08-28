import { CreatePublicationDto } from './dto/create-publication.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createPublication(data: CreatePublicationDto) {
    await this.prisma.publication.create({ data: data });
  }

  async readPublications() {
    const publications = await this.prisma.publication.findMany({});
    return publications;
  }

  async readPublicationId(id: number) {
    const publication = await this.prisma.publication.findUnique({
      where: { id: id },
    });
    return publication;
  }

  async updatePublicationId(id: number, data: CreatePublicationDto) {
    await this.prisma.publication.update({
      where: { id: Number(id) },
      data: { mediaId: data.mediaId, postId: data.postId, date: data.date },
    });
  }

  async deletePublicationId(id: number) {
    await this.prisma.publication.delete({ where: { id: id } });
  }
}
