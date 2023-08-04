import request from 'supertest';
import app from '../../../app';
import dataSource from '../../../data-source';
import UserFactory from '../../../factories/UserFactory';
import { UserEntity } from '../../../contexts/users/infrastructure/persistence/entities/UserEntity';
import { LinkEntity } from '../../../contexts/links/infrastructure/persistence/entities/LinkEntity';
import { BookmarkEntity } from '../../../contexts/bookmarks/infrastructure/persistence/entities/BookmarkEntity';
import LinkFactory from '../../../factories/LinkFactory';

describe('POST /bookmarks', () => {
  let auth: { body: { access_token: string; uuid: string; } };

  beforeAll(async () => {
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  beforeEach(async () => {
    const email = 'admin@butterfy.me';
    const password = 'password';
    const username = 'admin';
    await UserFactory.create({email, password, username});
    auth = await UserFactory.signIn(request, app, email, password);
  });

  afterEach(async () => {
    const bookmarkRepository = dataSource.getRepository(BookmarkEntity);
    await bookmarkRepository.delete({});

    const linkRepository = dataSource.getRepository(LinkEntity);
    await linkRepository.delete({});

    const userRepository = dataSource.getRepository(UserEntity);
    await userRepository.delete({});
  });

  it('returns 401 when the user is not logged to create bookmark', async () => {
    const res = await request(app).post('/bookmarks').send({});

    expect(res.statusCode).toEqual(401);
  });

  it('returns 400 when the mandatory field is empty creating bookmark', async () => {
    const res = await request(app)
      .post('/bookmarks')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Bad request');
  });

  it('returns 400 when the user does not exist', async () => {
    const res = await request(app)
      .post('/bookmarks')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        userUuid: 'xxxxxx',
        linkUuid: 'xxxxxx'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('User not found!');
  });

  it('returns 400 when the link does not exist', async () => {
    const res = await request(app)
      .post('/bookmarks')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        userUuid: auth.body.uuid,
        linkUuid: 'xxxxxx'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Link not found!');
  });

  it('returns 201 when the bookmark already exists', async () => {
    const linkUuid = 'linkUuid';
    await LinkFactory.create({uuid: linkUuid});

    const bookmarkRepository = dataSource.getRepository(BookmarkEntity);
    await bookmarkRepository.insert({
      uuid: 'xxxxxx',
      userUuid: auth.body.uuid,
      linkUuid: linkUuid
    });

    const res = await request(app)
      .post('/bookmarks')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        userUuid: auth.body.uuid,
        linkUuid: linkUuid
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('Bookmark created!');
  });

  it('returns 201 when the bookmark is created', async () => {
    const linkUuid = 'linkUuid';
    await LinkFactory.create({uuid: linkUuid});

    const res = await request(app)
      .post('/bookmarks')
      .auth(auth.body.access_token, { type: 'bearer' })
      .send({
        userUuid: auth.body.uuid,
        linkUuid: linkUuid
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('Bookmark created!');

    const bookmarkRepository = dataSource.getRepository(BookmarkEntity);
    const bookmark = await bookmarkRepository.findOneBy({
      userUuid: auth.body.uuid,
      linkUuid: linkUuid
    });
    expect(typeof bookmark.id).toBe("number");
    expect(bookmark.userUuid).toEqual(auth.body.uuid);
    expect(bookmark.linkUuid).toEqual(linkUuid);
  });

});