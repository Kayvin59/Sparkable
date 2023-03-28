import { describe, expect, test } from '@jest/globals';
import { MandatoryFieldEmptyException } from '../../users/domain/exceptions/MandatoryFieldEmptyException';
import { UserNotFoundException } from '../../users/domain/exceptions/UserNotFoundException';
import { User } from '../../users/domain/models/User';
import { UserRepositoryInMemory } from '../../users/infrastructure/persistence/repositories/UserRepositoryInMemory';
import { DataDoesExistException } from '../domain/exceptions/DataDoesExistException';
import { LinkNotFoundException } from '../domain/exceptions/LinkNotFoundException';
import { Link } from '../domain/models/Link';
import { ViewedLinkByUserData } from '../domain/models/ViewedLinkByUserData';
import { LinkRepositoryInMemory } from '../infrastructure/persistence/repositories/LinkRepositoryInMemory';
import { ViewedLinkByUserDataRepositoryInMemory } from '../infrastructure/persistence/repositories/ViewedLinkByUserDataRepositoryInMemory';
import { CreateViewedLinkByUserDataAction } from './CreateViewedLinkByUserDataAction';

describe('Create viewed link by user data action', () => {


  test('cant create viewed link by user data without user', async () => {
    const createViewedLinkByUserAction = new CreateViewedLinkByUserDataAction(
      new UserRepositoryInMemory(),
      new LinkRepositoryInMemory(),
      new ViewedLinkByUserDataRepositoryInMemory()
    );

    await expect(createViewedLinkByUserAction.execute('', '', 1)).rejects.toThrow(
      MandatoryFieldEmptyException,
    );
  });

  test('cant create viewed link by user data without link', async () => {
    const createViewedLinkByUserAction = new CreateViewedLinkByUserDataAction(
      new UserRepositoryInMemory(),
      new LinkRepositoryInMemory(),
      new ViewedLinkByUserDataRepositoryInMemory()
    );

    await expect(createViewedLinkByUserAction.execute('userUuid', '', 1)).rejects.toThrow(
      MandatoryFieldEmptyException,
    );
  });

  test('cant create viewed link by user data when the cycle does not exist', async () => {
    const createViewedLinkByUserAction = new CreateViewedLinkByUserDataAction(
      new UserRepositoryInMemory(),
      new LinkRepositoryInMemory(),
      new ViewedLinkByUserDataRepositoryInMemory()
    );

    await expect(createViewedLinkByUserAction.execute('userUuid', 'linkUuid', 0)).rejects.toThrow(
      MandatoryFieldEmptyException,
    );
  });

  test('cant create viewed link by user data when user not exists', async () => {
    const createViewedLinkByUserAction = new CreateViewedLinkByUserDataAction(
      new UserRepositoryInMemory(),
      new LinkRepositoryInMemory(),
      new ViewedLinkByUserDataRepositoryInMemory()
    );

    await expect(createViewedLinkByUserAction.execute('userUuid', 'linkUuid', 1)).rejects.toThrow(
      UserNotFoundException,
    );
  });

  test('cant create viewed link by user data when link not exists', async () => {
    const userRepositoryInMemory = new UserRepositoryInMemory();
    await userRepositoryInMemory.storeUser(new User('email', 'username', 'password', 'userUuid'));

    const createViewedLinkByUserAction = new CreateViewedLinkByUserDataAction(
      userRepositoryInMemory,
      new LinkRepositoryInMemory(),
      new ViewedLinkByUserDataRepositoryInMemory()
    );

    await expect(createViewedLinkByUserAction.execute('userUuid', 'linkUuid', 1)).rejects.toThrow(
      LinkNotFoundException,
    );
  });

  test('cant create viewed link by user data when data already does exist', async () => {
    const userUuid = 'userUuid';
    const userRepositoryInMemory = new UserRepositoryInMemory();
    const user = new User('email', 'username', 'password', userUuid)
    await userRepositoryInMemory.storeUser(user);

    const linkRepositoryInMemory = new LinkRepositoryInMemory();
    const linkDto = {
      title: 'title',
      url: 'url',
      categories: [{id:1, name:'name', slug:'name'}],
      userUuid: userUuid
    };
    const link = new Link(linkDto);
    linkRepositoryInMemory.storeLink(link);

    const viewedLinkByUserDataRepositoryInMemory = new ViewedLinkByUserDataRepositoryInMemory();
    viewedLinkByUserDataRepositoryInMemory.store(
      new ViewedLinkByUserData(user, link, 1)
    );

    const createViewedLinkByUserAction = new CreateViewedLinkByUserDataAction(
      userRepositoryInMemory,
      linkRepositoryInMemory,
      viewedLinkByUserDataRepositoryInMemory
    );

    await expect(createViewedLinkByUserAction.execute(userUuid, link.uuid, 1)).rejects.toThrow(
      DataDoesExistException,
    );
  });

  test('create viewed link by user data successfully', async () => {
    const userUuid = 'userUuid';
    const userRepositoryInMemory = new UserRepositoryInMemory();
    const userStage = 2;
    await userRepositoryInMemory.storeUser(
      new User('email', 'username', 'password', userUuid, userStage)
    );

    const linkRepositoryInMemory = new LinkRepositoryInMemory();
    const linkStage = 2;
    const linkDto = {
      title: 'title',
      url: 'url',
      categories: [{id:1, name:'name', slug:'name'}],
      userUuid: userUuid,
      stage: linkStage
    };
    const link = new Link(linkDto);
    linkRepositoryInMemory.storeLink(link);

    const viewedLinkByUserDataRepositoryInMemory = new ViewedLinkByUserDataRepositoryInMemory();

    const createViewedLinkByUserAction = new CreateViewedLinkByUserDataAction(
      userRepositoryInMemory,
      linkRepositoryInMemory,
      viewedLinkByUserDataRepositoryInMemory
    );

    const cycle = 1;
    await createViewedLinkByUserAction.execute(userUuid, link.uuid, cycle);

    expect(viewedLinkByUserDataRepositoryInMemory.collection.length).toEqual(1);
    expect(viewedLinkByUserDataRepositoryInMemory.collection[0].userUuid).toEqual(userUuid);
    expect(viewedLinkByUserDataRepositoryInMemory.collection[0].linkUuid).toEqual(link.uuid);
    expect(viewedLinkByUserDataRepositoryInMemory.collection[0].cycle).toEqual(cycle);
    expect(viewedLinkByUserDataRepositoryInMemory.collection[0].userStage).toEqual(userStage);
    expect(viewedLinkByUserDataRepositoryInMemory.collection[0].linkStage).toEqual(linkStage);
  });

});