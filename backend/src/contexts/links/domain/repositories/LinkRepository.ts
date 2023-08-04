import { Link } from '../models/Link';
import { LinkDto } from '../models/LinkDto';

export interface LinkRepository {
  getAllLinks: (
    sort?: string,
    categories?: string,
    page?: number,
    stage?: number
  ) => Promise<[LinkDto[], number]>;
  getLinkById: (id: number) => Promise<LinkDto | null>;
  storeLink: (link: Link) => Promise<number>;
  findLink: (field: string, value: string) => Promise<LinkDto | null>;
  getLinkCollectionNotOwned: (
    uuidCollection: Array<string>,
    userUuid: string
  ) => Promise<LinkDto[]>;
}
