import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from 'src/main-modules/tasks/tasks.module';
import { UserModule } from 'src/main-modules/user/user.module';

@Module({
  imports: [ScheduleModule.forRoot(), UserModule, TasksModule],
})
export class AppModule {}
