import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MailService } from '../mail/mail.service';
import { User } from '../user/user.types';
import { RedditService } from './reddit.service';

const axiosMock = new MockAdapter(axios);
const USER_MOCK: User = {
  id: 'rkBIKRlhP',
  email: 'clovisdasilvaneto@gmail.com',
  password: '123',
  name: 'clovis neto',
  subscribed: true,
  channels: ['NewsWorld'],
};

jest.mock('src/db', () => ({
  default: {
    collection: () => ({
      list: () => [USER_MOCK],
    }),
  },
  findWhere: () => [USER_MOCK],
}));

const MOCKED_RESULT = {
  data: {
    children: [
      {
        kind: 't3',
        data: {
          title: 'Sand Sculpture in Parksville, British Columbia.',
          thumbnail:
            'https://b.thumbs.redditmedia.com/QY-lnHPj7tDYBHlHwnuM-5F2Xp9O8ahKpD-X74nPcdE.jpg',
          ups: '213',
          url: 'http://something.jpg',
        },
      },
    ],
  },
};

axiosMock
  .onGet(/https:\/\/www.reddit.com\/r\/.+\/top\/.json\?limit=3\&t=day/)
  .reply(200, MOCKED_RESULT);

describe('RedditService', () => {
  let redditService: RedditService;
  let mailService: MailService;

  beforeEach(() => {
    mailService = new MailService();
    redditService = new RedditService(mailService);
  });

  it('should schedule the reddit mails', async () => {
    const sendEmailMock = jest.fn();
    const getMostVottedPostsMock = jest.fn();

    jest
      .spyOn(redditService, 'getMostVottedPosts')
      .mockImplementation(getMostVottedPostsMock);

    jest
      .spyOn(mailService, 'sendDynamicEmail')
      .mockImplementation(sendEmailMock);

    await redditService.handleCron();

    expect(sendEmailMock).toBeCalled();
    expect(getMostVottedPostsMock).toBeCalledWith('NewsWorld', 0, [
      'NewsWorld',
    ]);
  });

  it('should get the most votted posts', async () => {
    const channel = 'News';
    const mostVottedPosts = await redditService.getMostVottedPosts(channel);

    expect(mostVottedPosts).toMatchObject({
      channel,
      posts: [
        {
          hasImage: true,
          image: MOCKED_RESULT.data.children[0].data.url,
          rate: MOCKED_RESULT.data.children[0].data.ups,
          url: MOCKED_RESULT.data.children[0].data.url,
        },
      ],
    });
  });
});
