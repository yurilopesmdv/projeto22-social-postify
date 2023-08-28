import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaModule } from '../../src/prisma/prisma.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { AppModule } from '../../src/app.module';

describe('PostController (e2e)', () => {
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

  it('POST /posts => should post media and respond with status code 201', async () => {
    const response = await request(app.getHttpServer()).post('/posts').send({
      title: 'test',
      text: 'test',
    });
    expect(response.status).toBe(HttpStatus.CREATED);
  });
  it('POST /posts => should not post the media and respond with status code 400', async () => {
    const response = await request(app.getHttpServer()).post('/posts').send({
      title: '',
      text: '',
    });
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });
  it('/posts => should get media and respond with status code 200', async () => {
    const response = await request(app.getHttpServer()).get('/posts');
    expect(response.status).toBe(HttpStatus.OK);
  });
  it('DELETE /posts/:id => should delete post and respond with status code', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/posts')
      .send({
        title: 'test',
        text: 'test',
      });
    const postId = createResponse.body.id;
    const deleteResponse = await request(app.getHttpServer()).delete(
      `/posts/${postId}`,
    );
    expect(deleteResponse.status).toBe(HttpStatus.NO_CONTENT);
    const deletedPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    expect(deletedPost).toBe(null);
  });

  it('PUT /posts/:id => should update the post ', async () => {
    // Primeiro, você precisa criar um post para obter seu ID
    const createResponse = await request(app.getHttpServer())
      .post('/posts')
      .send({
        title: 'test',
        text: 'test',
      });
    const postId = createResponse.body.id;
    const updateResponse = await request(app.getHttpServer())
      .put(`/posts/${postId}`)
      .send({
        title: 'Updated Title',
        text: 'Updated Text',
      });
    expect(updateResponse.status).toBe(HttpStatus.NO_CONTENT);
    const updatedPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    expect(updatedPost.title).toBe('Updated Title');
  });

  it('GET /posts/:id => should respond with the post and status code 200', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/posts')
      .send({
        title: 'test',
        text: 'test',
      });
    const postId = createResponse.body.id;
    const getByIdResponse = await request(app.getHttpServer()).get(
      `/posts/${postId}`,
    );
    expect(getByIdResponse.status).toBe(HttpStatus.OK);
  });
});
