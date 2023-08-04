import { UserDto } from "../../../users/domain/models/UserDto";
import { UserRepository } from "../../../users/domain/repositories/UserRepository";
import { UserNotFoundException } from "../exceptions/UserNotFoundException";

export class CheckUserExistsService {
  private userRepository: UserRepository;

  constructor(
    userRepository: UserRepository
  ) {
    this.userRepository = userRepository;
  }

  async execute(userUuid: string): Promise<UserDto> {
    const user = await this.userRepository.findUser({ uuid: userUuid });
    if (!user)
      throw new UserNotFoundException();

    return user;
  }

}