import { Injectable } from '@nestjs/common';
import {
  SEND_GRID_API_KEY,
  SEND_GRID_DYNAMIC_TEMPLATE_ID,
  SEND_GRID_SENDER,
} from 'src/config';
import { User } from 'src/main-modules/user/user.types';

const sgMail = require('@sendgrid/mail');

@Injectable()
export class MailService {
  async sendDynamicEmail(dynamicTemplate): Promise<any> {
    sgMail.setApiKey(SEND_GRID_API_KEY);

    const msg = {
      from: SEND_GRID_SENDER,
      personalizations: dynamicTemplate,
      template_id: SEND_GRID_DYNAMIC_TEMPLATE_ID,
    };

    return sgMail.send(msg).catch((error) => {
      console.error(error.response.body);
      throw 'Error when sending dynamic email';
    });
  }

  getDynamicTemplateFormat(user: User, mostVottedPost) {
    return {
      to: [
        {
          email: user.email,
        },
      ],
      dynamic_template_data: {
        username: user.name,
        channels: mostVottedPost,
      },
    };
  }
}
