import { describe, expect, test } from '@jest/globals';
import { UserNotFoundException } from '../../_shared/domain/exceptions/UserNotFoundException';
import { WrongPasswordException } from '../domain/exceptions/WrongPasswordException';
import { User } from '../domain/models/User';
import { UserRepositoryInMemory } from '../infrastructure/persistence/repositories/UserRepositoryInMemory';
import { SignInAction } from './SignInAction';
import { AuthService } from '../domain/services/AuthService';
import { AuthServiceJWT } from '../infrastructure/services/AuthServiceJWT';

describe('signing in', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthServiceJWT();
  })

  test('cant sign in because the username does not exist', async () => {
    const userRepository = new UserRepositoryInMemory();
    const signInAction = new SignInAction(userRepository, authService);

    await expect(signInAction.execute('password', 'username')).rejects.toThrow(
      UserNotFoundException,
    );
  });

  test('cant sign in because the email does not exist', async () => {
    const userRepository = new UserRepositoryInMemory();
    const signInAction = new SignInAction(userRepository, authService);

    await expect(signInAction.execute('password', 'email')).rejects.toThrow(
      UserNotFoundException,
    );
  });

  test('cant sign in because the password is wrong', async () => {
    const userRepository = new UserRepositoryInMemory();
    const username = 'username';
    const email = 'email';
    const password = 'password';
    await userRepository.storeUser(new User(email, username, password));
    const signInAction = new SignInAction(userRepository, authService);

    await expect(
      signInAction.execute('wrong password', username, email),
    ).rejects.toThrow(WrongPasswordException);
  });

  test('can sign in with username', async () => {
    const userRepository = new UserRepositoryInMemory();
    const username = 'username';
    const email = 'email';
    const password = 'password';
    await userRepository.storeUser(new User(email, username, password));
    const signInAction = new SignInAction(userRepository, authService);

    const res = await signInAction.execute(password, username);

    expect(res.token_type).toEqual('Bearer');
    expect(res).toHaveProperty('expires_in');
    expect(res).toHaveProperty('access_token');
  });

  test('can sign in with email', async () => {
    const userRepository = new UserRepositoryInMemory();
    const username = 'username';
    const email = 'email';
    const password = 'password';
    const user = new User(email, username, password);
    await userRepository.storeUser(user);
    const signInAction = new SignInAction(userRepository, authService);

    const res = await signInAction.execute(password, '', email);

    expect(res.token_type).toEqual('Bearer');
    expect(res).toHaveProperty('access_token');
    expect(res.access_token).not.toBeNull();
    expect(res).toHaveProperty('uuid');
    expect(res.uuid).toEqual(user.getUuid);
    expect(res.username).toEqual(username);
    expect(res.stage).toEqual(1);
  });
});
