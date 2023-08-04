import { MandatoryFieldEmptyException } from '../../../_shared/domain/exceptions/MandatoryFieldEmptyException';
import { BookmarkDto } from './BookmarkDto';

export class Bookmark {
  private userUuid: string;
  private linkUuid: string;

  constructor(
    userUuid: string,
    linkUuid: string
  ) {
    if (!userUuid || !linkUuid ) {
      throw new MandatoryFieldEmptyException();
    }

    this.userUuid = userUuid;
    this.linkUuid = linkUuid;
  }

  public toDto(): BookmarkDto {
    return {
      userUuid: this.userUuid,
      linkUuid: this.linkUuid
    };
  }
}