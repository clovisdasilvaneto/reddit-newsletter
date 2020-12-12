import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import store, { findWhere } from 'src/fakedb';
import { MailService } from 'src/main-modules/mail/mail.service';
import { User } from '../user/user.types';
import { Posts } from './reddit.types';

const numeral = require('numeral');

@Injectable()
export class RedditService {
  constructor(private readonly mailService: MailService) {}
  private readonly logger = new Logger(RedditService.name);

  // Every 8:00AM - https://docs.nestjs.com/techniques/task-scheduling
  @Cron('0 0 8 * * *')
  async handleCron() {
    const users = store.collection<User>('users');
    const activeUsers = findWhere(users, (user) => user.subscribed);

    const dynamicTemplate: any = await Promise.all(
      activeUsers.map(async (user) => {
        const mostVottedPosts = await Promise.all(
          user.channels.map(this.getMostVottedPosts),
        );

        return this.mailService.getDynamicTemplateFormat(user, mostVottedPosts);
      }),
    );

    await this.mailService.sendDynamicEmail(dynamicTemplate);

    this.logger.debug('Emails has been sent to users channel');
  }

  async getMostVottedPosts(
    channel,
  ): Promise<{ channel: string; posts: Posts[] }> {
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
  }
}
