import { describe, expect, test } from '@jest/globals';
import { User } from '../models/User';
import { MandatoryFieldEmptyException } from '../../../_shared/domain/exceptions/MandatoryFieldEmptyException';
import { ShortPasswordException } from '../exceptions/ShortPasswordException';
import bcrypt from 'bcrypt';

describe('Create User', () => {
  test('cant create user without mandatory field', async () => {
    expect(() => new User('', 'username', 'password'))
    .toThrow(MandatoryFieldEmptyException);
  });

  test('cant create user because the password is not 8 characters', async () => {
    expect(() => new User('email', 'username', 'pass'))
    .toThrow(ShortPasswordException);
  });

  test('create user', async () => {
    const email = 'email';
    const username = 'admin';
    const user = new User(email, username, 'password');

    expect(user.getEmail).toEqual(email);
    expect(user.getUsername).toEqual(username);
    expect(user.getUuid).not.toBeNull();
    expect(user.getStage).toEqual(1);
  });

  test('password is encrypted when user is created', async () => {
    const password = 'password';
    const user = new User('email', 'username', password);

    expect(await bcrypt.compare(password, user.getPassword)).toBe(true);
  });

});
