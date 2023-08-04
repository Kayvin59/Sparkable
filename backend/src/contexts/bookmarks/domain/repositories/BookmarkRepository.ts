import { Bookmark } from "../models/Bookmark";
import { BookmarkDto } from "../models/BookmarkDto";

export interface BookmarkRepository {
    findBookmark: (params:Object) => Promise<BookmarkDto | null>;
    storeBookmark: (bookmark: Bookmark) => Promise<number>;
    removeBookmark: (bookmark: Bookmark) => Promise<any>;
}