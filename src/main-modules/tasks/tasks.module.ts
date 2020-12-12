import { Module } from '@nestjs/common';
import { MailModule } from '../mail/mail.module';
import { RedditService } from './reddit.service';

@Module({
  providers: [RedditService],
  imports: [MailModule],
})
export class TasksModule {}
