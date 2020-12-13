import { SEND_GRID_DYNAMIC_TEMPLATE_ID, SEND_GRID_SENDER } from 'src/config';
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

const MOCKED_ID = 'asdiajh3MOCKED_ID';

jest.mock('src/db', () => {
  return {
    default: {
      collection: () => ({
        list: () => [USER_MOCK],
        get: (userId) => [USER_MOCK].find(({ id }) => id === userId),
        update: (data) => data,
        create: (_user: User) => MOCKED_ID,
      }),
    },
    findWhere: () => [USER_MOCK],
  };
});

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
  });

  it('should return an userId when create service is called', async () => {
    const createdUserId = await userService.create(USER_MOCK);

    expect(createdUserId).toBe(MOCKED_ID);
  });

  it('should trown an error when it trys to update an user who does not exist', async () => {
    expect(() => {
      userService.update('an-random-id', USER_MOCK);
    }).toThrow('User does not exist');
  });

  it('should return the updated data after an user is succefully updated', async () => {
    const updatedUser = userService.update(USER_MOCK.id, USER_MOCK);

    expect(updatedUser).toMatchObject(USER_MOCK);
  });

  it('should return an user object if it exists on database', async () => {
    const user = userService.findOne(USER_MOCK.id);

    expect(user).toMatchObject(USER_MOCK);
  });

  it('should return an array of users', async () => {
    const users = userService.findAll();

    expect(users).toMatchObject([USER_MOCK]);
  });
});
