import request from 'supertest';
import app from '../../app';
import { UserEntity } from '../../contexts/users/infrastructure/persistence/entities/UserEntity';
import dataSource from '../../data-source';

describe('POST /user', () => {
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

  it('returns 400 when the mandatory field is empty', async () => {
    const req = await request(app).post('/user').send({
      email: '',
      username: 'admin',
      password: 'password',
    });

    expect(req.statusCode).toEqual(400);
  });

  it('returns 400 when the password is less than 8 characters', async () => {
    const res = await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: 'admin',
      password: 'pass',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Password is too short!');
  });

  it('returns 201 when the user is created', async () => {
    const req = await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: 'admin',
      password: 'password',
    });

    expect(req.statusCode).toEqual(201);
    expect(req.body.message).toEqual('User created!');

    const repository = dataSource.getRepository(UserEntity);
    const [users, total] = await repository.findAndCount();
    expect(total).toEqual(1);
    expect(users[0].registrationDate).toBeInstanceOf(Date);
    expect(users[0].stage).toEqual(1);
  });

  it('returns 403 when email exists', async () => {
    await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: 'admin',
      password: 'password',
    });

    const res = await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: 'admin2',
      password: 'password',
    });
    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual('User exist!');
  });

  it('returns 403 when username exists', async () => {
    await request(app).post('/user').send({
      email: 'admin@butterfy.me',
      username: 'admin',
      password: 'password',
    });

    const res = await request(app).post('/user').send({
      email: 'admin2@butterfy.me',
      username: 'admin',
      password: 'password',
    });
    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toEqual('User exist!');
  });

});