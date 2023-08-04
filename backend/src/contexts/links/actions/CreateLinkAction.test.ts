import { describe, expect, test } from '@jest/globals';
import { MandatoryFieldEmptyException } from '../../_shared/domain/exceptions/MandatoryFieldEmptyException';
import { UserNotFoundException } from '../../_shared/domain/exceptions/UserNotFoundException';
import { User } from '../../users/domain/models/User';
import { UserRepository } from '../../users/domain/repositories/UserRepository';
import { UserRepositoryInMemory } from '../../users/infrastructure/persistence/repositories/UserRepositoryInMemory';
import { CategoryNotFoundException } from '../domain/exceptions/CategoryNotFoundException';
import { CategoryRestrictionException } from '../domain/exceptions/CategoryRestrictionException';
import { LinkExistsException } from '../domain/exceptions/LinkExistsException';
import { CategoryRepository } from '../domain/repositories/CategoryRepository';
import { LinkRepository } from '../domain/repositories/LinkRepository';
import { CategoryRepositoryInMemory } from '../infrastructure/persistence/repositories/CategoryRepositoryInMemory';
import { LinkRepositoryInMemory } from '../infrastructure/persistence/repositories/LinkRepositoryInMemory';
import { CreateLinkAction } from './CreateLinkAction';
import { MockProxy, mock } from 'jest-mock-extended';
import { MailerService } from '../../users/domain/services/MailerService';
import { CheckUserExistsService } from '../../_shared/domain/services/CheckUserExistsService';

describe('Create link action', () => {
  let createLinkAction: CreateLinkAction;
  let linkRepository: LinkRepository;
  let categoryRepository: CategoryRepository;
  let userRepository: UserRepository;
  let mailServiceMock: MockProxy<MailerService>;

  beforeEach(async () => {
    linkRepository = new LinkRepositoryInMemory();
    categoryRepository = new CategoryRepositoryInMemory();
    userRepository = new UserRepositoryInMemory();
    mailServiceMock = mock<MailerService>();
    createLinkAction = new CreateLinkAction(
      linkRepository,
      categoryRepository,
      new CheckUserExistsService(userRepository),
      mailServiceMock
    );
  });

  test('cant create link without mandatory field', async () => {
    await expect(createLinkAction.execute({})).rejects.toThrow(
      MandatoryFieldEmptyException,
    );
  });

  test('cant create link with only title', async () => {
    await expect(createLinkAction.execute({ title: 'title' })).rejects.toThrow(
      MandatoryFieldEmptyException,
    );
  });

  test('cant create link with only title and url', async () => {
    await expect(
      createLinkAction.execute({ title: 'title', link: 'http://example' }),
    ).rejects.toThrow(MandatoryFieldEmptyException);
  });

  test('cant create link is category is not a well format array ', async () => {
    await expect(
      createLinkAction.execute({
        title: 'title',
        url: 'http://example',
        categories: ['Environment', 'Arts'],
      }),
    ).rejects.toThrow(MandatoryFieldEmptyException);
  });

  test('cant create link with only categories', async () => {
    await expect(
      createLinkAction.execute({
        categories: [{id:1, name:'name', slug:'name'}],
      }),
    ).rejects.toThrow(MandatoryFieldEmptyException);
  });

  test('cant create link without user', async () => {
    await expect(
      createLinkAction.execute({
        title: 'title',
        url: 'http://example',
        categories: [
          {id:1, name:'name', slug:'name'},
        ],
      }),
    ).rejects.toThrow(MandatoryFieldEmptyException);
  });

  test('cant create link with more than 2 categories', async () => {
    await expect(
      createLinkAction.execute({
        title: 'title',
        url: 'http://example',
        userUuid: 'xxxxxx',
        categories: [
          {id:1, name:'name', slug:'name'},
          {id:2, name:'name2', slug:'name2'},
          {id:3, name:'name3', slug:'name3'}
        ],
      }),
    ).rejects.toThrow(CategoryRestrictionException);
  });

  test('cant create link when the category does not exist', async () => {
    await expect(
      createLinkAction.execute({
        title: 'title',
        url: 'http://example',
        userUuid: 'xxxxxx',
        categories: [
          {id:1, name:'name', slug:'name'},
        ],
      }),
    ).rejects.toThrow(CategoryNotFoundException);
  });

  test('should throw error when user does not exists', async () => {
    const categoryDto = {id:1, name:'name', slug:'name'};
    const categoryRepository = new CategoryRepositoryInMemory(
      [categoryDto]
    );
    createLinkAction = new CreateLinkAction(
      linkRepository,
      categoryRepository,
      new CheckUserExistsService(userRepository),
      mailServiceMock
    );

    await expect(
      createLinkAction.execute({
        title: 'title 2',
        url: 'http://example',
        userUuid: 'xxxxxx',
        categories: [categoryDto],
      }),
    ).rejects.toThrow(UserNotFoundException);
  });

  test('should throw error when link exists', async () => {
    const categoryDto = {id:1, name:'name', slug:'name'};
    const categoryRepository = new CategoryRepositoryInMemory(
      [categoryDto]
    );

    const userUuid = 'xxxxx';
    const user = new User(
      'admin@butterfy.me',
      'admin',
      'password',
      userUuid
    );
    userRepository.storeUser(user);

    createLinkAction = new CreateLinkAction(
      linkRepository,
      categoryRepository,
      new CheckUserExistsService(userRepository),
      mailServiceMock
    );

    const url = 'http://example';

    await createLinkAction.execute({
      title: 'title',
      url: url,
      userUuid: userUuid,
      categories: [categoryDto],
    });

    await expect(
      createLinkAction.execute({
        title: 'title 2',
        url: url,
        userUuid: userUuid,
        categories: [categoryDto],
      }),
    ).rejects.toThrow(LinkExistsException);
  });

  test('create link with mandatory field', async () => {
    const title = 'title';
    const url = 'http://example';

    const categoryDto = {id:1, name:'name', slug:'name'};
    const categoryRepository = new CategoryRepositoryInMemory(
      [categoryDto]
    );

    const userUuid = 'xxxxx';
    const user = new User(
      'admin@butterfy.me',
      'admin',
      'password',
      userUuid
    );
    userRepository.storeUser(user);

    createLinkAction = new CreateLinkAction(
      linkRepository,
      categoryRepository,
      new CheckUserExistsService(userRepository),
      mailServiceMock
    );

    await createLinkAction.execute({
      title: title,
      url: url,
      categories: [categoryDto],
      userUuid: userUuid
    });

    const [links, total] = await linkRepository.getAllLinks();

    expect(total).toEqual(1);
    expect(links[0].title).toEqual(title);
    expect(links[0].url).toEqual(url);
    expect(links[0].categories).toEqual([categoryDto]);

    expect(mailServiceMock.sendEmail).toHaveBeenCalled();
    const link = `${process.env.CLIENT}/article/${links[0].id}}`;
    expect(mailServiceMock.sendEmail).toHaveBeenCalledWith({
      from: 'support@sparkable.cc',
      to: 'support@sparkable.cc',
      subject: 'New link has been created!',
      html: `
        <html>
        <head>
            <style>
            </style>
        </head>
        <body>
            <p>A new link has been created!</p>
            <p><a href="${link}">${links[0].title}</a></p>
        </body>
        </html>
        `,
    });
  });

  test('create link with optional field', async () => {
    const title = 'title';
    const url = 'http://example';
    const image = 'http://image';
    const description = '123';
    const statement =  'Lorem ipsum';
    const suggestion = 'Sports';

    const categoryDto = {id:1, name:'name', slug:'name'};
    const categoryRepository = new CategoryRepositoryInMemory(
      [categoryDto]
    );

    const userUuid = 'xxxxx';
    const user = new User(
      'admin@butterfy.me',
      'admin',
      'password',
      userUuid
    );
    userRepository.storeUser(user);

    createLinkAction = new CreateLinkAction(
      linkRepository,
      categoryRepository,
      new CheckUserExistsService(userRepository),
      mailServiceMock
    );

    await createLinkAction.execute({
      title: title,
      url: url,
      categories: [categoryDto],
      image: image,
      description: description,
      userUuid: userUuid,
      statement: statement,
      suggestionCategory: suggestion
    });

    const [links, total] = await linkRepository.getAllLinks();

    expect(total).toEqual(1);
    expect(links[0].image).toEqual(image);
    expect(links[0].description).toEqual(description);
    expect(links[0].statement).toEqual(statement);
    expect(links[0].suggestionCategory).toEqual(suggestion);
  });

});