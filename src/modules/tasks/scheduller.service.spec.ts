import { MailService } from 'src/modules/mail/mail.service';
import { RedditService } from 'src/modules/reddit/reddit.service';
import { SchedulerService } from './scheduller.service';

describe('SchedulerService', () => {
  let scheduler: SchedulerService;
  let redditService: RedditService;
  let mailService: MailService;

  beforeEach(() => {
    mailService = new MailService();
    redditService = new RedditService(mailService);
    scheduler = new SchedulerService(redditService);
  });

  it('should throw an error when email function is rejected', async () => {
    const mockFn = jest.fn();
    jest.spyOn(redditService, 'sendTopChannels').mockImplementation(mockFn);

    await scheduler.handleCron();

    expect(mockFn).toBeCalled();
  });

  it('should throw an error when email function is rejected', async () => {
    const MOCKED_ERROR = 'an error';
    jest
      .spyOn(redditService, 'sendTopChannels')
      .mockImplementation(() => Promise.reject(MOCKED_ERROR));

    expect.assertions(2);

    try {
      await scheduler.handleCron();
    } catch (e) {
      expect(e).toBeDefined();
      expect(e).toContain(MOCKED_ERROR);
    }
  });
});
