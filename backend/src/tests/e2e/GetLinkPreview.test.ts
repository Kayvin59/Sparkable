import request from 'supertest';
import app from '../../app';
import { UserEntity } from '../../contexts/users/infrastructure/persistence/entities/UserEntity';
import dataSource from '../../data-source';

describe('POST /link-preview', () => {

  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  afterEach(async () => {
    const repository = dataSource.getRepository(UserEntity);
    await repository.clear();
  });

  it('returns 401 when the user is not logged', async () => {
    const res = await request(app).post('/link-preview-data').send({});

    expect(res.statusCode).toEqual(401);
  });

  it('returns 400 when the body is empty', async () => {
    const email = 'admin@butterfy.me';
    const password = 'password';
    await request(app).post('/user').send({
      email: email,
      username: 'admin',
      password: password,
    });
    const resSignIn = await request(app).post('/signin').send({
      password: password,
      email: email,
    });

    const res = await request(app)
    .post('/link-preview-data')
    .auth(resSignIn.body.access_token, { type: 'bearer' })
    .send({});

    expect(res.statusCode).toEqual(400);
  });

});