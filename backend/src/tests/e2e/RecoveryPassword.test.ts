import request from 'supertest';
import app from '../../app';
import { ResetTokenEntity } from '../../contexts/users/infrastructure/persistence/entities/ResetTokenEntity';
import dataSource from '../../data-source';

describe('POST /recovery-password', () => {

  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  afterEach(async () => {
    const repository = dataSource.getRepository(ResetTokenEntity);
    await repository.delete({});
  });

  it('returns 400 when the body is empty', async () => {
    const res = await request(app).post('/recovery-password').send({});

    expect(res.statusCode).toEqual(400);
  });

  it('returns 200 when the email does not exist', async () => {
    const res = await request(app).post('/recovery-password').send({
      email: 'test@test.com'
    });

    expect(res.statusCode).toEqual(200);
  });



});