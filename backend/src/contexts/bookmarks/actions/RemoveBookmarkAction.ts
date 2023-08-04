import { Bookmark } from "../domain/models/Bookmark";
import { BookmarkRepository } from "../domain/repositories/BookmarkRepository";

export class RemoveBookmarkAction {
  private bookmarkRepository: BookmarkRepository;

  constructor(
    bookmarkRepository: BookmarkRepository
  ) {
    this.bookmarkRepository = bookmarkRepository;
  }

  async execute(userUuid: string, linkUuid: string) {
    await this.bookmarkRepository.removeBookmark(new Bookmark(userUuid, linkUuid));
  }

}