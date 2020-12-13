import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import store, { findWhere } from 'src/db';
import { MailService } from 'src/modules/mail/mail.service';
import { User } from '../user/user.types';
import { Posts } from './reddit.types';

const numeral = require('numeral');

@Injectable()
export class RedditService {
  constructor(private readonly mailService: MailService) {}
  private readonly logger = new Logger(RedditService.name);

  sendTopChannels(): Promise<any> {
    const users = store.collection<User>('users');
    const activeUsers: User[] = findWhere(users, (user) => user.subscribed);

    if (!activeUsers.length) return;

    return this.sendChannels(activeUsers);
  }

  async sendChannels(activeUsers: User[]) {
    try {
      const dynamicTemplate: any = await Promise.all(
        activeUsers.map(async (user) => {
          const mostVottedPosts = await Promise.all(
            user.channels.map(this.getMostVottedPosts),
          );

          return this.mailService.getDynamicTemplateFormat(
            user,
            mostVottedPosts,
          );
        }),
      );

      return this.mailService.sendDynamicEmail(dynamicTemplate);
    } catch (e) {
      this.logger.error('Error during sending top channels', e);
    }
  }

  async getMostVottedPosts(
    channel,
  ): Promise<{ channel: string; posts: Posts[] }> {
    try {
      const {
        data: {
          data: { children },
        },
      } = await axios.get(
        `https://www.reddit.com/r/${channel}/top/.json?limit=3&t=day`,
      );

      const posts: Posts[] = children.map(({ data: { title, url, ups } }) => ({
        title,
        // It's not clear when there are image on the reddit
        hasImage: /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(url),
        image: url,
        url,
        rate: numeral(parseInt(ups)).format('0a'),
      }));

      return {
        channel,
        posts,
      };
    } catch (e) {
      this.logger.error('Error while getting most votted posts', e);
    }
  }
}
