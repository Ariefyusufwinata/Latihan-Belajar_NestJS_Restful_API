import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let logger: Logger;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
  });

  it('should be rejected if request is invalid', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/users')
      .send({
        username: '',
        password: '',
        name: '',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it('should be able to register', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/users')
      .send({
        username: 'test',
        password: 'test',
        name: 'test',
      });

    logger.debug(response.body);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('test');
    expect(response.body.name).toBe('test');
  });
});
