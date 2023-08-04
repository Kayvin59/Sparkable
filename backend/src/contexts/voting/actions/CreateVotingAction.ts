import { LinkDto } from "../../links/domain/models/LinkDto";
import { LinkUuidDto } from "../../links/domain/models/LinkUuidDto";
import { ViewedLinkByUserData } from "../../links/domain/models/ViewedLinkByUserData";
import { ViewedLinkByUserDataDto } from "../../links/domain/models/ViewedLinkByUserDataDto";
import { LinkRepository } from "../../links/domain/repositories/LinkRepository";
import { ViewedLinkByUserDataRepository } from "../../links/domain/repositories/ViewedLinkByUserDataRepository";
import { MandatoryFieldEmptyException } from "../../_shared/domain/exceptions/MandatoryFieldEmptyException";
import { UserDto } from "../../users/domain/models/UserDto";
import { UserRepository } from "../../users/domain/repositories/UserRepository";
import { LinkNotOpenedByUserException } from "../domain/exceptions/LinkNotOpenedByUserException";
import { NumberOfVotesExceededException } from "../domain/exceptions/NumberOfVotesExceededException";
import { UserHasAlreadyVotedException } from "../domain/exceptions/UserHasAlreadyVotedException";
import { UserHasNotOpenedAnyLinksException } from "../domain/exceptions/UserHasNotOpenedAnyLinksException";
import { Vote } from "../domain/models/Vote";
import { Voting } from "../domain/models/Voting";
import { VoteRepository } from "../domain/repositories/VoteRepository";
import { VotingRepository } from "../domain/repositories/VotingRepository";
import { GetCurrentCycleService } from "../domain/services/GetCurrentCycleService";

export class CreateVotingAction {
  viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository;
  voteRepository: VoteRepository;
  votingRepository: VotingRepository;
  userRepository: UserRepository;
  linkRepository: LinkRepository;

  constructor(
    viewedLinkByUserDataRepository: ViewedLinkByUserDataRepository,
    voteRepository: VoteRepository,
    votingRepository: VotingRepository,
    userRepository: UserRepository,
    linkRepository: LinkRepository
  ) {
    this.viewedLinkByUserDataRepository = viewedLinkByUserDataRepository;
    this.voteRepository = voteRepository;
    this.votingRepository = votingRepository;
    this.userRepository = userRepository;
    this.linkRepository = linkRepository;
  }

  async execute(userUuid: string, votes: Array<LinkUuidDto>, date?: Date) {
    this.userUuidIsNotEmpty(userUuid);
    this.checkNumberOfVotesMaximum(votes);

    const currentCycle = GetCurrentCycleService.execute(date).cycle;

    const hasVotedThisCycle = await this.votingRepository.findVoting({
      userUuid: userUuid,
      cycle: currentCycle
    });
    if (hasVotedThisCycle) throw new UserHasAlreadyVotedException();

    const [dataCollection, total] = await this.viewedLinkByUserDataRepository.getAllData({
      userUuid: userUuid,
      voted: false
    });

    await this.checkUserHasOpenedALink(total);
    await this.checkLinksHaveOpened(votes, dataCollection);

    let countVotes = await this.storeVotes(userUuid, votes, currentCycle);

    const voting = new Voting(userUuid, currentCycle, countVotes);
    await this.votingRepository.storeVoting(voting);

    this.updateAsVotedViewedLinksData(votes, dataCollection);
  }

  private userUuidIsNotEmpty(userUuid: string) {
    if (!userUuid)
      throw new MandatoryFieldEmptyException();
  }

  private checkNumberOfVotesMaximum(votes: any[]) {
    if (votes.length > 7) {
      throw new NumberOfVotesExceededException;
    }
  }

  private async checkUserHasOpenedALink(total: number) {
    if (!total) {
      throw new UserHasNotOpenedAnyLinksException;
    }
  }

  private async checkLinksHaveOpened(votes: Array<any>, dataCollection: Array<ViewedLinkByUserDataDto>) {
    const linkUuidCollection = dataCollection.map(data => {
      return data.linkUuid ;
    });

    votes.forEach(vote => {
      if (!linkUuidCollection.includes(vote.linkUuid)) {
        throw new LinkNotOpenedByUserException;
      }
    });
  }

  private async storeVotes(userUuid: string, votes: LinkUuidDto[], currentCycle: number) {
    const userDto = await this.userRepository.findUser({ uuid: userUuid });

    let countVotes = 0;
    for (let index = 0; index < votes.length; index++) {
      const vote = votes[index];
      const linkDto = await this.linkRepository.findLink('uuid', vote.linkUuid);

      if (linkDto && userDto && this.isUserNotOwnerTheLink(linkDto, userDto)) {
        countVotes++;
        await this.voteRepository.storeVote(
          new Vote({
            userUuid,
            linkUuid: vote.linkUuid,
            cycle: currentCycle,
            userStage: userDto?.stage || 0,
            linkStage: linkDto?.stage || 0,
            date: new Date()
          })
        );
      }
    };

    return countVotes;
  }

  private isUserNotOwnerTheLink(link:LinkDto, user:UserDto) {
    return link?.userUuid !== user?.uuid;
  }

  private updateAsVotedViewedLinksData(votes: LinkUuidDto[], dataCollection: ViewedLinkByUserDataDto[]) {
    const votedLinkUuidCollection = votes.map(vote => {
      return vote.linkUuid;
    });
    dataCollection.forEach(async (data) => {
      if (votedLinkUuidCollection.includes(data.linkUuid)) {
        await this.viewedLinkByUserDataRepository.store(
          new ViewedLinkByUserData(
            data.userUuid,
            data.linkUuid,
            data.cycle,
            data.userStage,
            data.linkStage,
            true
          )
        );
      }
    });
  }

}