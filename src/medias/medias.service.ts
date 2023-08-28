import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediasRepository } from './medias.repository';

@Injectable()
export class MediasService {
  constructor(private readonly mediasRepository: MediasRepository) {}
  async create(data: CreateMediaDto) {
    if (!data.title || !data.username)
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    const media = await this.mediasRepository.readMedia(data);
    if (media) throw new HttpException('Conflict', HttpStatus.CONFLICT);
    await this.mediasRepository.createMedia(data);
  }

  async findAll() {
    return await this.mediasRepository.readMedias();
  }

  async findOne(id: number) {
    const media = await this.mediasRepository.readMediaId(id);
    if (!media) throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return media;
  }

  async update(id: number, data: CreateMediaDto) {
    const mediaExists = await this.mediasRepository.readMediaId(id);
    if (!mediaExists)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    const conflictExists = await this.mediasRepository.readMedia(data);
    if (conflictExists)
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    const media = await this.mediasRepository.updateMediaId(+id, data);
    return media;
  }

  async remove(id: number) {
    const mediaExists = await this.mediasRepository.readMediaId(id);
    if (!mediaExists)
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    return await this.mediasRepository.deleteMediaId(+id);
  }
}
