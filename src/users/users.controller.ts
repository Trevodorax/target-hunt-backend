import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('search')
  searchUser(@Query('search-string') searchString: string) {
    return this.usersService.search({ search: searchString });
  }
}
