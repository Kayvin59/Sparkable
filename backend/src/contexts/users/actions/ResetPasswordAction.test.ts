import { ResetPasswordAction } from "./ResetPasswordAction";
import { ResetTokenRepositoryInMemory } from "../infrastructure/persistence/repositories/ResetTokenRepositoryInMemory";
import { UserRepositoryInMemory } from "../infrastructure/persistence/repositories/UserRepositoryInMemory";
import { MandatoryFieldEmptyException } from "../../_shared/domain/exceptions/MandatoryFieldEmptyException";
import { ShortPasswordException } from "../domain/exceptions/ShortPasswordException";
import { UserNotFoundException } from "../../_shared/domain/exceptions/UserNotFoundException";
import { User } from "../domain/models/User";
import { TokenNotFoundException } from "../domain/exceptions/TokenNotFoundException";
import { TokenIsExpiredException } from "../domain/exceptions/TokenIsExpiredException";
import { ResetToken } from "../domain/models/ResetToken";
import bcrypt from 'bcrypt';

describe('Reset password action', () => {
  let userRepository: UserRepositoryInMemory;
  let resetTokenRepository: ResetTokenRepositoryInMemory;

  beforeEach(() => {
    userRepository = new UserRepositoryInMemory();
    resetTokenRepository = new ResetTokenRepositoryInMemory();
  })

  test('Cant reset password when userId is a required parameter', async () => {
    const resetPasswordAction = new ResetPasswordAction(
      userRepository,
      resetTokenRepository
    );

    await expect(resetPasswordAction.execute('', '', '')).rejects.toThrow(
      MandatoryFieldEmptyException
    );
  });

  test('Cant reset password when token is a required parameter', async () => {
    const resetPasswordAction = new ResetPasswordAction(
      userRepository,
      resetTokenRepository
    );

    await expect(resetPasswordAction.execute('xxxxxx', '', '')).rejects.toThrow(
      MandatoryFieldEmptyException
    );
  });

  test('Cant reset password when password is a required parameter', async () => {
    const resetPasswordAction = new ResetPasswordAction(
      userRepository,
      resetTokenRepository
    );

    await expect(resetPasswordAction.execute('xxxxxx', 'xxxxxx', '')).rejects.toThrow(
      MandatoryFieldEmptyException
    );
  });

  test('Cant reset password when user not exist in database', async () => {
    const resetPasswordAction = new ResetPasswordAction(
      userRepository,
      resetTokenRepository
    );

    await expect(resetPasswordAction.execute('xxxxxx', 'xxxxxx', '12345678')).rejects.toThrow(
      UserNotFoundException
    );
  });

  test('Cant reset password when password is less 8 length', async () => {
    const user = new User('test@test.com', 'user', 'password');
    await userRepository.storeUser(user);

    const resetPasswordAction = new ResetPasswordAction(
      userRepository,
      resetTokenRepository
    );

    await expect(resetPasswordAction.execute(user.getUuid, 'xxxxxx', '1234567')).rejects.toThrow(
      ShortPasswordException
    );
  });

  test('Cant reset password when token does not exist', async () => {
    const user = new User('test@test.com', 'user', 'password');
    await userRepository.storeUser(user);

    const resetPasswordAction = new ResetPasswordAction(
      userRepository,
      resetTokenRepository
    );

    await expect(resetPasswordAction.execute(user.getUuid, 'xxxxxx', '12345678')).rejects.toThrow(
      TokenNotFoundException
    );
  });

  test('Cant reset password when token is expired', async () => {
    const user = new User('test@test.com', 'user', 'password');
    await userRepository.storeUser(user);

    const token = 'XXXXXXX';
    const dateExpired = new Date();
    dateExpired.setDate(dateExpired.getDate() - 1);
    const resetToken = new ResetToken(user.getUuid, token, dateExpired);
    resetTokenRepository.saveToken(resetToken);

    const resetPasswordAction = new ResetPasswordAction(
      userRepository,
      resetTokenRepository
    );

    await expect(resetPasswordAction.execute(user.getUuid, token, '12345678')).rejects.toThrow(
      TokenIsExpiredException
    );
  });

  test('Reset password when token is not expired', async () => {
    const username = 'username';
    const user = new User('test@test.com', username, 'password');
    await userRepository.storeUser(user);

    const token = 'XXXXXXX';
    const resetToken = new ResetToken(user.getUuid, token);
    resetTokenRepository.saveToken(resetToken);

    const resetPasswordAction = new ResetPasswordAction(
      userRepository,
      resetTokenRepository
    );

    const password = '12345678';
    await resetPasswordAction.execute(user.getUuid, token, password);

    const userDto = await userRepository.findUser({ uuid: user.getUuid });
    expect(await bcrypt.compare(password, userDto?.password as string)).toBe(true);
  });

});