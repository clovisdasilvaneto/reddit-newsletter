import { Module } from '@nestjs/common';
import { RedditModule } from 'src/main-modules/reddit/reddit.module';
import { SchedullerService } from './scheduller.service';

@Module({
  providers: [SchedullerService],
  imports: [RedditModule],
})
export class TasksModule {}
