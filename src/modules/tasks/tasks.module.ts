import { Module } from '@nestjs/common';
import { RedditModule } from 'src/modules/reddit/reddit.module';
import { SchedulerService } from './scheduller.service';

@Module({
  providers: [SchedulerService],
  imports: [RedditModule],
})
export class TasksModule {}
