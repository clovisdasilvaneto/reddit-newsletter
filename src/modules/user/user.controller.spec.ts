import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.types';

const USER_MOCK: User = {
  id: 'rkBIKRlhP',
  email: 'clovisdasilvaneto@gmail.com',
  password: '123',
  name: 'clovis neto',
  subscribed: true,
  channels: ['NewsWorld', 'worldnews'],
};

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    userController = new UserController(userService);
  });

  it('should return an array of user', async () => {
    const result = [USER_MOCK, { ...USER_MOCK, name: 'another user name' }];
    jest.spyOn(userService, 'findAll').mockImplementation(() => result);

    expect(await userController.findAll()).toBe(result);
  });

  it('should return a single of user', async () => {
    jest.spyOn(userService, 'findOne').mockImplementation(() => USER_MOCK);

    expect(await userController.findOne({ id: USER_MOCK.id })).toBe(USER_MOCK);
  });

  it('should create a new user', async () => {
    jest.spyOn(userService, 'create').mockImplementation(() => USER_MOCK.id);

    expect(await userController.create(USER_MOCK)).toMatchObject({
      id: USER_MOCK.id,
    });
  });

  it('should update an existent user', async () => {
    const UPDATED_USER = {
      email: 'somename@gmail.com',
      password: '123',
      name: 'An user name',
      subscribed: true,
      channels: ['worldnews'],
    };

    jest
      .spyOn(userService, 'update')
      .mockImplementation(() => ({ ...UPDATED_USER, id: USER_MOCK.id }));

    expect(
      await userController.update(USER_MOCK.id, UPDATED_USER),
    ).toMatchObject({ ...UPDATED_USER, id: USER_MOCK.id });
  });
});
