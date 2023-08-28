import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AppModule } from '../../src/app.module';

describe('MediaController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService);

    await prisma.media.deleteMany();
    await prisma.post.deleteMany();
    await prisma.publication.deleteMany();
    await app.init();
  });

  it('POST /media => should respond with status code 201', async () => {
    const response = await request(app.getHttpServer()).post('/medias').send({
      title: 'Instagram',
      username: 'jorge',
    });

    expect(response.status).toBe(HttpStatus.CREATED);

    const user = await prisma.media.findFirst({
      where: {
        username: 'jorge',
      },
    });
    expect(user).not.toBe(null);
  });

  it('POST /media => should respond with a status code 400', async () => {
    const response = await request(app.getHttpServer()).post('/medias').send({
      title: '',
      username: '',
    });
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('GET /media   => should media sucessfully', async () => {
    const response = await request(app.getHttpServer()).get('/medias');
    expect(response.status).toBe(HttpStatus.OK);
  });

  it('DELETE /media/:id => should delete the media', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/medias')
      .send({
        title: 'Instagram',
        username: 'jorge',
      });

    const mediaId = createResponse.body.id;
    const deleteResponse = await request(app.getHttpServer()).delete(
      `/medias/${mediaId}`,
    );
    expect(deleteResponse.status).toBe(HttpStatus.NO_CONTENT);
    const deletedMedia = await prisma.media.findUnique({
      where: {
        id: mediaId,
      },
    });

    expect(deletedMedia).toBe(null);
  });

  it('PUT /media/:id => should update media', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/medias')
      .send({
        title: 'Instagram',
        username: 'jorge',
      });
    const mediaId = createResponse.body.id;
    const updateResponse = await request(app.getHttpServer())
      .put(`/medias/${mediaId}`)
      .send({
        title: 'Updated Instagram',
        username: 'jorginho',
      });

    expect(updateResponse.status).toBe(HttpStatus.NO_CONTENT);
    const updatedMedia = await prisma.media.findUnique({
      where: {
        id: mediaId,
      },
    });

    expect(updatedMedia.title).toBe('Updated Instagram');
  });

  it('GET /media/:id => should respond with status code 200 and with the media', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/medias')
      .send({
        title: 'Instagram',
        username: 'jorge',
      });
    const mediaId = createResponse.body.id;
    const getByIdResponse = await request(app.getHttpServer()).get(
      `/medias/${mediaId}`,
    );
    expect(getByIdResponse.status).toBe(HttpStatus.OK);
  });
});
