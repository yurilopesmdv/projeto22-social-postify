import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AppModule } from '../../src/app.module';
import { faker } from '@faker-js/faker';
import { AllFactories } from '../factories/all.factory';
import { PrismaModule } from '../../src/prisma/prisma.module';

describe('PublicationController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let allFactories: AllFactories;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = app.get(PrismaService);

    await prisma.publication.deleteMany();
    await prisma.media.deleteMany();
    await prisma.post.deleteMany();

    await app.init();
    allFactories = new AllFactories();
  });

  it('POST /publications => should create publication and respond with status code 201', async () => {
    const { id: postId } = await allFactories.createPost(prisma);
    const { id: mediaId } = await allFactories.createMedia(prisma);
    const date = faker.date.future().toISOString();

    const { status } = await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId,
        postId,
        date,
      });

    expect(status).toBe(HttpStatus.CREATED);
  });

  it('POST /publications => should not create the media and respond with status code 400media fail 400', async () => {
    const response = await request(app.getHttpServer())
      .post('/publications')
      .send({
        mediaId: '',
        postId: '',
        date: '',
      });
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('/publications  => should get the media and respond with status code 200', async () => {
    const response = await request(app.getHttpServer()).get('/publications');
    expect(response.status).toBe(HttpStatus.OK);
  });
});
