import { MandatoryFieldEmptyException } from '../../_shared/domain/exceptions/MandatoryFieldEmptyException';
import { User } from '../../users/domain/models/User';
import { Link } from '../domain/models/Link';
import { ViewedLinkByUserData } from '../domain/models/ViewedLinkByUserData';
import { LinkRepositoryInMemory } from '../infrastructure/persistence/repositories/LinkRepositoryInMemory';
import { ViewedLinkByUserDataRepositoryInMemory } from '../infrastructure/persistence/repositories/ViewedLinkByUserDataRepositoryInMemory';
import { GetViewedLinksAction } from './GetViewedLinksAction';

let linkDto = {
  title: 'title',
  url: 'url',
  userUuid: 'userUuid',
  categories: [{ id: 1, name: 'name', slug: 'name' }],
  stage: 1,
};

describe('Get viewed links action', () => {

  test('cant get viewed links without user', async () => {
    const getViewedLinkByUserDataAction = new GetViewedLinksAction(
      new ViewedLinkByUserDataRepositoryInMemory(),
      new LinkRepositoryInMemory(),
    );

    await expect(
      getViewedLinkByUserDataAction.execute('')
    ).rejects.toThrow(MandatoryFieldEmptyException);
  });

  test('returns empty links if there are no links', async () => {
    const getAllMyViewedLinkAction = new GetViewedLinksAction(
      new ViewedLinkByUserDataRepositoryInMemory(),
      new LinkRepositoryInMemory(),
    );

    await expect(
      getAllMyViewedLinkAction.execute('userUuid'),
    ).resolves.toEqual([]);
  });

  test('returns one link', async () => {
    const user = new User('email', 'username', 'password');

    const linkRepoInMemory = new LinkRepositoryInMemory();
    const title = 'title';
    linkDto.title = title;
    linkDto.userUuid = user.getUuid;
    const link = new Link(linkDto);
    linkRepoInMemory.storeLink(link);

    const viewedLinkByUserDataRepositoryInMemory = new ViewedLinkByUserDataRepositoryInMemory();

    viewedLinkByUserDataRepositoryInMemory.store(
      new ViewedLinkByUserData(user.getUuid, link.uuid, 1)
    );

    const getAllMyViewedLinkAction = new GetViewedLinksAction(
      viewedLinkByUserDataRepositoryInMemory,
      linkRepoInMemory,
    );

    const links = await getAllMyViewedLinkAction.execute(user.getUuid);

    expect(links.length).toEqual(1);
    expect(links[0].title).toEqual(title);
    expect(links[0].userUuid).toEqual(user.getUuid);
    expect(links[0].stage).toEqual(1);
  });

  test('returns multiple links', async () => {
    const user = new User('email', 'username', 'password');

    const linkRepoInMemory = new LinkRepositoryInMemory();
    linkDto.userUuid = user.getUuid;
    const link = new Link(linkDto);
    linkRepoInMemory.storeLink(link);
    const link2 = new Link(linkDto);
    linkRepoInMemory.storeLink(link2);

    const viewedLinkByUserDataRepositoryInMemory = new ViewedLinkByUserDataRepositoryInMemory();

    viewedLinkByUserDataRepositoryInMemory.store(
      new ViewedLinkByUserData(user.getUuid, link.uuid, 1)
    );
    viewedLinkByUserDataRepositoryInMemory.store(
      new ViewedLinkByUserData(user.getUuid, link2.uuid, 1)
    );

    const getAllMyViewedLinkAction = new GetViewedLinksAction(
      viewedLinkByUserDataRepositoryInMemory,
      linkRepoInMemory,
    );

    const links = await getAllMyViewedLinkAction.execute(user.getUuid);

    expect(links.length).toEqual(2);
    expect(links[0].userUuid).toEqual(user.getUuid);
    expect(links[1].userUuid).toEqual(user.getUuid);
  });

});
