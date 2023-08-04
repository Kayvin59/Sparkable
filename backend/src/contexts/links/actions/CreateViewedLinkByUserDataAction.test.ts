import { describe, expect, test } from '@jest/globals';
import { MandatoryFieldEmptyException } from '../../_shared/domain/exceptions/MandatoryFieldEmptyException';
import { UserNotFoundException } from '../../_shared/domain/exceptions/UserNotFoundException';
import { User } from '../../users/domain/models/User';
import { UserRepository } from '../../users/domain/repositories/UserRepository';
import { UserRepositoryInMemory } from '../../users/infrastructure/persistence/repositories/UserRepositoryInMemory';
import { DataDoesExistException } from '../domain/exceptions/DataDoesExistException';
import { LinkNotFoundException } from '../../_shared/domain/exceptions/LinkNotFoundException';
import { Link } from '../domain/models/Link';
import { ViewedLinkByUserData } from '../domain/models/ViewedLinkByUserData';
import { LinkRepository } from '../domain/repositories/LinkRepository';
import { ViewedLinkByUserDataRepository } from '../domain/repositories/ViewedLinkByUserDataRepository';
import { LinkRepositoryInMemory } from '../infrastructure/persistence/repositories/LinkRepositoryInMemory';
import { ViewedLinkByUserDataRepositoryInMemory } from '../infrastructure/persistence/repositories/ViewedLinkByUserDataRepositoryInMemory';
import { CreateViewedLinkByUserDataAction } from './CreateViewedLinkByUserDataAction';

describe('Create viewed link by user data action', () => {
  let userRepository: UserRepository;
  let linkRepository: LinkRepository;
  let viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository;
  let createViewedLinkByUserAction: CreateViewedLinkByUserDataAction;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(async () => {
    userRepository = new UserRepositoryInMemory();
    linkRepository = new LinkRepositoryInMemory();
    viewedLinkByUserDataRepository = new ViewedLinkByUserDataRepositoryInMemory();

    createViewedLinkByUserAction = new CreateViewedLinkByUserDataAction(
      userRepository,
      linkRepository,
      viewedLinkByUserDataRepository
    );
  });

  test('cant create viewed link by user data without user', async () => {
    await expect(createViewedLinkByUserAction.execute('', '')).rejects.toThrow(
      MandatoryFieldEmptyException,
    );
  });

  test('cant create viewed link by user data without link', async () => {
    await expect(createViewedLinkByUserAction.execute('userUuid', '')).rejects.toThrow(
      MandatoryFieldEmptyException,
    );
  });

  test('cant create viewed link by user data when user not exists', async () => {
    await expect(createViewedLinkByUserAction.execute('userUuid', 'linkUuid')).rejects.toThrow(
      UserNotFoundException,
    );
  });

  test('cant create viewed link by user data when link not exists', async () => {
    await userRepository.storeUser(new User('email', 'username', 'password', 'userUuid'));

    await expect(createViewedLinkByUserAction.execute('userUuid', 'linkUuid')).rejects.toThrow(
      LinkNotFoundException,
    );
  });

  test('cant create viewed link by user data when data already does exist', async () => {
    const userUuid = 'userUuid';
    const user = new User('email', 'username', 'password', userUuid)
    await userRepository.storeUser(user);

    const linkDto = {
      title: 'title',
      url: 'url',
      categories: [{id:1, name:'name', slug:'name'}],
      userUuid: userUuid
    };
    const link = new Link(linkDto);
    linkRepository.storeLink(link);

    viewedLinkByUserDataRepository.store(
      new ViewedLinkByUserData(user.getUuid, link.uuid, 1)
    );

    jest.setSystemTime(new Date(2023, 3, 7));
    await expect(createViewedLinkByUserAction.execute(userUuid, link.uuid)).rejects.toThrow(
      DataDoesExistException,
    );
  });

  test('create viewed link by user data successfully', async () => {
    const userUuid = 'userUuid';
    const userStage = 1;
    await userRepository.storeUser(
      new User('email', 'username', 'password', userUuid, userStage)
    );

    const linkStage = 1;
    const linkDto = {
      title: 'title',
      url: 'url',
      categories: [{id:1, name:'name', slug:'name'}],
      userUuid: userUuid,
      stage: linkStage
    };
    const link = new Link(linkDto);
    linkRepository.storeLink(link);

    jest.setSystemTime(new Date('Apr 1, 2023 00:00:00'));
    await createViewedLinkByUserAction.execute(userUuid, link.uuid);

    const [collection, total] = await viewedLinkByUserDataRepository.getAllData({});
    expect(total).toEqual(1);
    expect(collection[0].userUuid).toEqual(userUuid);
    expect(collection[0].linkUuid).toEqual(link.uuid);
    expect(collection[0].cycle).toEqual(1);
    expect(collection[0].userStage).toEqual(userStage);
    expect(collection[0].linkStage).toEqual(linkStage);
  });

  test('create viewed link by user data on second cycle', async () => {
    const userUuid = 'userUuid';
    await userRepository.storeUser(
      new User('email', 'username', 'password', userUuid)
    );

    const linkDto = {
      title: 'title',
      url: 'url',
      categories: [{id:1, name:'name', slug:'name'}],
      userUuid: userUuid
    };
    const link = new Link(linkDto);
    linkRepository.storeLink(link);

    jest.setSystemTime(new Date('Apr 11, 2023 00:00:00'));
    await createViewedLinkByUserAction.execute(userUuid, link.uuid);

    const [collection, total] = await viewedLinkByUserDataRepository.getAllData({});
    expect(total).toEqual(1);
    expect(collection[0].cycle).toEqual(2);
  });

  test('create viewed link with the current user stage and link stage', async () => {
    const userUuid = 'userUuid';
    const userStage = 2;
    await userRepository.storeUser(
      new User('email', 'username', 'password', userUuid, userStage)
    );

    const linkStage = 2;
    const linkDto = {
      title: 'title',
      url: 'url',
      categories: [{id:1, name:'name', slug:'name'}],
      userUuid: userUuid,
      stage: linkStage
    };
    const link = new Link(linkDto);
    linkRepository.storeLink(link);

    jest.setSystemTime(new Date('Apr 1, 2023 00:00:00'));
    await createViewedLinkByUserAction.execute(userUuid, link.uuid);

    const [collection, total] = await viewedLinkByUserDataRepository.getAllData({});
    expect(total).toEqual(1);
    expect(collection[0].userStage).toEqual(userStage);
    expect(collection[0].linkStage).toEqual(linkStage);
  });

});