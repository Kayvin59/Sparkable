import { LinkDto } from "../../../links/domain/models/LinkDto";
import { LinkRepository } from "../../../links/domain/repositories/LinkRepository";
import { LinkNotFoundException } from "../exceptions/LinkNotFoundException";

export class CheckLinkExistsService {
  private linkRepository: LinkRepository;

  constructor(
    linkRepository: LinkRepository
  ) {
    this.linkRepository = linkRepository;
  }

  async execute(linkUuid: string): Promise<LinkDto | null> {
    const link = await this.linkRepository.findLink('uuid', linkUuid);
    if (!link)
      throw new LinkNotFoundException();

    return link;
  }

}