import { describe, expect, test } from '@jest/globals';
import dataSource from '../../data-source';
import { ResetTokenEntity } from '../../contexts/users/infrastructure/persistence/entities/ResetTokenEntity';
import { ResetTokenRepositoryPG } from '../../contexts/users/infrastructure/persistence/repositories/ResetTokenRepositoryPG';
import { ResetToken } from '../../contexts/users/domain/models/ResetToken';

describe('ResetTokenRepositoryPG', () => {

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

  test('update the token when exists one for this user', async () => {
    const resetTokenRepositoryPG = new ResetTokenRepositoryPG(dataSource);

    const userUuid = 'userUuid';
    const firstToken = 'firstToken';
    await resetTokenRepositoryPG.saveToken(new ResetToken(userUuid, firstToken));

    const secondToken = 'secondToken';
    await resetTokenRepositoryPG.saveToken(new ResetToken(userUuid, secondToken));

    const repository = dataSource.getRepository(ResetTokenEntity);
    const [tokens, total] = await repository.findAndCount();

    expect(total).toEqual(1);
    expect(tokens[0].userUuid).toEqual(userUuid);
    expect(tokens[0].token).toEqual(secondToken);
  });

});