import { Module } from '@nestjs/common';
import { MailModule } from 'src/main-modules/mail/mail.module';
import { RedditService } from './reddit.service';

@Module({
  providers: [RedditService],
  exports: [RedditService],
  imports: [MailModule],
})
export class RedditModule {}
