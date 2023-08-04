import { MandatoryFieldEmptyException } from '../../_shared/domain/exceptions/MandatoryFieldEmptyException';
import { LinkDto } from '../domain/models/LinkDto';
import { LinkRepository } from '../domain/repositories/LinkRepository';
import { ViewedLinkByUserDataRepository } from '../domain/repositories/ViewedLinkByUserDataRepository';

export class GetViewedLinksAction {
  viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository;
  linkRepository: LinkRepository;

  constructor(
    viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository,
    linkRepository: LinkRepository,
  ) {
    this.viewedLinkByUserDataRepository = viewedLinkByUserDataRepository;
    this.linkRepository = linkRepository;
  }

  async execute(userUuid: string) {
    if (!userUuid) {
      throw new MandatoryFieldEmptyException();
    }

    const [viewedLinksNotVoted, total] =
      await this.viewedLinkByUserDataRepository.getAllDataByUserNotVoted(
        userUuid
      );

    let links: LinkDto[] = [];
    if (total !== 0) {
      links = await this.linkRepository.getLinkCollectionNotOwned(
        viewedLinksNotVoted.map((viewedLink) => viewedLink.linkUuid),
        userUuid
      );
    }

    return links;
  }

}
