import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RedditService } from 'src/main-modules/reddit/reddit.service';

@Injectable()
export class SchedullerService {
  constructor(private readonly redditService: RedditService) {}
  private readonly logger = new Logger(RedditService.name);

  // Every 8:00AM - https://docs.nestjs.com/techniques/task-scheduling
  @Cron('0 0 8 * * *')
  async handleCron() {
    await this.redditService.sendTopChannels();

    this.logger.debug('Emails has been sent to users channel');
  }
}
