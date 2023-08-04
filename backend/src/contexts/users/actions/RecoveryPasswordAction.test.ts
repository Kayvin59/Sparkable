import { UserNotFoundException } from "../../_shared/domain/exceptions/UserNotFoundException";
import { User } from "../domain/models/User";
import { MailerService } from "../domain/services/MailerService";
import { ResetTokenRepositoryInMemory } from "../infrastructure/persistence/repositories/ResetTokenRepositoryInMemory";
import { UserRepositoryInMemory } from "../infrastructure/persistence/repositories/UserRepositoryInMemory";
import { MockProxy, mock } from 'jest-mock-extended';
import { MandatoryFieldEmptyException } from "../../_shared/domain/exceptions/MandatoryFieldEmptyException";
import { RecoveryPasswordAction } from "./RecoveryPasswordAction";

describe('Recovery password action', () => {
  let userRepository: UserRepositoryInMemory;
  let resetTokenRepository: ResetTokenRepositoryInMemory;
  let mailServiceMock: MockProxy<MailerService>;

  beforeEach(() => {
    userRepository = new UserRepositoryInMemory();
    resetTokenRepository = new ResetTokenRepositoryInMemory();
    mailServiceMock = mock<MailerService>();
  })

  test('Email is a required parameter', async () => {
    const recoveryPasswordAction = new RecoveryPasswordAction(
      userRepository,
      resetTokenRepository,
      mailServiceMock
    );

    await expect(recoveryPasswordAction.execute('')).rejects.toThrow(
      MandatoryFieldEmptyException
    );
  });

  test('Dont send email when user does not exist', async () => {
    const recoveryPasswordAction = new RecoveryPasswordAction(
      userRepository,
      resetTokenRepository,
      mailServiceMock
    );

    await expect(recoveryPasswordAction.execute('user@email.com')).rejects.toThrow(
      UserNotFoundException
    );
  });

  test('Send email with temporary link when user exist', async () => {
    const email = 'user@email.com';
    await userRepository.storeUser(new User(email, 'user', 'password'));
    const recoveryPasswordAction = new RecoveryPasswordAction(
      userRepository,
      resetTokenRepository,
      mailServiceMock
    );

    await recoveryPasswordAction.execute(email);

    expect(resetTokenRepository.all().length).toEqual(1);
    expect(resetTokenRepository.all()[0].token).not.toBeNull();
    expect(mailServiceMock.sendEmail).toHaveBeenCalled();
  });

});