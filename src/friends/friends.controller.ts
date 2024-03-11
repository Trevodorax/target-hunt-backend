import { Controller, Delete, Get, Param } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { GetUser } from 'src/auth/decorators/user.decorator';

@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}
  @Delete(':id')
  removeFriend(@GetUser('id') userId: string, @Param('id') friendId: string) {
    this.friendsService.removeFriend(userId, friendId);
  }

  @Get()
  getFriends(@GetUser('id') id: string) {
    return this.friendsService.getAllFriends(id);
  }
}
