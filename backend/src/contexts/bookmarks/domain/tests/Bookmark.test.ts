import { describe, expect, test } from '@jest/globals';
import { Bookmark } from '../models/Bookmark';
import { MandatoryFieldEmptyException } from '../../../_shared/domain/exceptions/MandatoryFieldEmptyException';

describe('Create Bookmark', () => {
  test('cant create Bookmark without userUuid field', async () => {
    expect(() => new Bookmark('', 'linkUuid'))
    .toThrow(MandatoryFieldEmptyException);
  });

  test('cant create Bookmark without linkUuid field', async () => {
    expect(() => new Bookmark('userUuid', ''))
    .toThrow(MandatoryFieldEmptyException);
  });

  test('create Bookmark', async () => {
    const userUuid = 'userUuid';
    const linkUuid = 'linkUuid';
    const bookmark = new Bookmark(userUuid, linkUuid);

    const bookmarkDto = bookmark.toDto();
    expect(bookmarkDto.userUuid).toEqual(userUuid);
    expect(bookmarkDto.linkUuid).toEqual(linkUuid);
  });

});
