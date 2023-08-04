import { MandatoryFieldEmptyException } from '../../../_shared/domain/exceptions/MandatoryFieldEmptyException';
import { ViewedLinkByUserDataDto } from './ViewedLinkByUserDataDto';

export class ViewedLinkByUserData {
  userUuid: string;
  linkUuid: string;
  cycle: number;
  userStage: number;
  linkStage: number;
  voted: boolean;

  constructor(
    userUuid:string,
    linkUuid:string,
    cycle: number,
    userStage: number = 1,
    linkStage: number = 1,
    voted: boolean = false,
  ) {
    if (!userUuid || !linkUuid || !cycle) {
      throw new MandatoryFieldEmptyException();
    }

    this.userUuid = userUuid;
    this.linkUuid = linkUuid;
    this.cycle = cycle;
    this.userStage = userStage;
    this.linkStage = linkStage;
    this.voted = voted
  }

  public toDto(): ViewedLinkByUserDataDto {
    return {
      userUuid: this.userUuid,
      linkUuid: this.linkUuid,
      cycle: this.cycle,
      userStage: this.userStage,
      linkStage: this.linkStage,
      voted: this.voted
    };
  }
}
