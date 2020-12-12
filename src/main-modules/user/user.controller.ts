import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { User, CreateUserValidator, UpdateUserValidator } from './user.types';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): User[] {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param() params): User | void {
    return this.userService.findOne(params.id);
  }

  @Post()
  create(@Body() userBody: CreateUserValidator): object {
    //it is syncronous because we use nonrealdb
    const id = this.userService.create(userBody);

    return { id };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() userBody: UpdateUserValidator): User {
    //it is syncronous because we use nonrealdb
    return this.userService.update(id, userBody);
  }
}
