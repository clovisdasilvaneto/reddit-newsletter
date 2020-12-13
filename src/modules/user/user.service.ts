import { Injectable } from '@nestjs/common';
import store from 'src/db';

import { User, UserBody } from './user.types';

@Injectable()
export class UserService {
  create(user: UserBody): string {
    const users = store.collection<User>('users');
    return users.create(user);
  }

  update(userId: string, userData: UserBody) {
    const users = store.collection<User>('users');
    const user = users.get(userId);

    if (!user) throw 'User does not exist';

    const data = { ...user, ...userData };

    users.update(data);

    return data;
  }

  findAll(): User[] {
    const users = store.collection<User>('users');
    return users.list();
  }

  findOne(userId: string): User | void {
    const users = store.collection<User>('users');
    return users.get(userId);
  }
}
