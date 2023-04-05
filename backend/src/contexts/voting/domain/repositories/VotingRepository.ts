import { Voting } from "../models/Voting";
import { VotingDto } from "../models/VotingDto";

export interface VotingRepository {
  storeVoting: (vote:Voting) => Promise<VotingDto>
}