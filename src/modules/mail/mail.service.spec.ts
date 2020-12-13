import { SEND_GRID_DYNAMIC_TEMPLATE_ID, SEND_GRID_SENDER } from 'src/config';
import { MailService } from './mail.service';

jest.mock('@sendgrid/mail', () => ({
  setApiKey: (API_KEY) => API_KEY,
  send: (msg) =>
    Object.keys(msg.personalizations).length
      ? Promise.resolve(msg)
      : Promise.reject(msg),
}));

describe('MailService', () => {
  let mailService: MailService;

  beforeEach(() => {
    mailService = new MailService();
  });

  it('should send email with personalizations to a dynamic template target', async () => {
    const emailTemplate = {
      username: 'something',
    };
    const email = await mailService.sendDynamicEmail(emailTemplate);

    expect(email).toMatchObject({
      from: SEND_GRID_SENDER,
      personalizations: emailTemplate,
      template_id: SEND_GRID_DYNAMIC_TEMPLATE_ID,
    });
  });

  it('should throw an error when email function is rejected', async () => {
    const emailTemplate = {};

    expect.assertions(1);

    try {
      await mailService.sendDynamicEmail(emailTemplate);
    } catch (e) {
      expect(e).toBeDefined();
    }
  });
});
