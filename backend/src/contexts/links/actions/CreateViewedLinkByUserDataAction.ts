import { MandatoryFieldEmptyException } from '../../_shared/domain/exceptions/MandatoryFieldEmptyException';
import { UserNotFoundException } from '../../_shared/domain/exceptions/UserNotFoundException';
import { UserRepository } from '../../users/domain/repositories/UserRepository';
import { GetCurrentCycleService } from '../../voting/domain/services/GetCurrentCycleService';
import { DataDoesExistException } from '../domain/exceptions/DataDoesExistException';
import { LinkNotFoundException } from '../../_shared/domain/exceptions/LinkNotFoundException';
import { ViewedLinkByUserData } from '../domain/models/ViewedLinkByUserData';
import { LinkRepository } from '../domain/repositories/LinkRepository';
import { ViewedLinkByUserDataRepository } from '../domain/repositories/ViewedLinkByUserDataRepository';

export class CreateViewedLinkByUserDataAction {
  userRepository: UserRepository;
  linkRepository: LinkRepository;
  viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository;

  constructor(
    userRepository: UserRepository,
    linkRepository: LinkRepository,
    viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository
  ) {
    this.userRepository = userRepository;
    this.linkRepository = linkRepository;
    this.viewedLinkByUserDataRepository = viewedLinkByUserDataRepository;
  }

  async execute(userUuid: string, linkUuid: string) {
    if (!userUuid || !linkUuid) {
      throw new MandatoryFieldEmptyException();
    }

    const user = await this.checkUserDoesExist(userUuid);
    const link = await this.checkLinkDoesExist(linkUuid);

    const data = new ViewedLinkByUserData(
      userUuid,
      linkUuid,
      GetCurrentCycleService.execute().cycle,
      user.stage,
      link.stage
    );
    await this.checkDataIsNew(userUuid, linkUuid);
    this.viewedLinkByUserDataRepository.store(data);
  }

  private async checkUserDoesExist(userUuid: string) {
    const user = await this.userRepository.findUser({ uuid: userUuid });
    if (!user)
      throw new UserNotFoundException();

    return user;
  }

  private async checkLinkDoesExist(linkUuid: string) {
    const link = await this.linkRepository.findLink('uuid', linkUuid);
    if (!link)
      throw new LinkNotFoundException();

    return link;
  }

  private async checkDataIsNew(userUuid: string, linkUuid: string) {
    const dataInDatabase = await this.viewedLinkByUserDataRepository.findData({
      userUuid: userUuid,
      linkUuid: linkUuid
    });
    if (dataInDatabase)
      throw new DataDoesExistException();
  }

}