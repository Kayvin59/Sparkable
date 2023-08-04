import { Bookmark } from "../domain/models/Bookmark";
import { BookmarkRepository } from "../domain/repositories/BookmarkRepository";
import { BookmarkReallyDoesExistException } from "../domain/exceptions/BookmarkReallyDoesExistException";
import { CheckUserExistsService } from "../../_shared/domain/services/CheckUserExistsService";
import { CheckLinkExistsService } from "../../_shared/domain/services/CheckLinkExistsService";

export class CreateBookmarkAction {
  private bookmarkRepository: BookmarkRepository;
  private checkUserExistsService: CheckUserExistsService;
  private checkLinkExistsService: CheckLinkExistsService;

  constructor(
    bookmarkRepository: BookmarkRepository,
    checkUserExistsService: CheckUserExistsService,
    checkLinkExistsService: CheckLinkExistsService
  ) {
    this.bookmarkRepository = bookmarkRepository;
    this.checkUserExistsService = checkUserExistsService;
    this.checkLinkExistsService = checkLinkExistsService;
  }

  async execute(userUuid: string, linkUuid: string) {
    const bookmark = new Bookmark(userUuid, linkUuid);
    await this.checkUserExistsService.execute(userUuid);
    await this.checkLinkExistsService.execute(linkUuid);
    await this.checkBookmarkExists(userUuid, linkUuid);
    await this.bookmarkRepository.storeBookmark(bookmark);
  }

  private async checkBookmarkExists(userUuid:string, linkUuid: string) {
    const bookmark = await this.bookmarkRepository.findBookmark({
      userUuid: userUuid,
      linkUuid: linkUuid
    });

    if (bookmark)
      throw new BookmarkReallyDoesExistException();
  }

}