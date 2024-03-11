import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { FriendRequestsService } from './friendRequests.service';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { FriendRequestSchema } from 'target-hunt-bridge';
import { z } from 'zod';

@Controller('friend-requests')
export class FriendRequestsController {
  constructor(private friendRequestsService: FriendRequestsService) {}

  @Post()
  sendInvite(
    @GetUser('id') userId: string,
    @Body('receiverId') receiverId: string,
  ): Promise<void> {
    return this.friendRequestsService.sendInvite(userId, receiverId);
  }

  @Get('received')
  getReceivedInvites(
    @GetUser('id') userId: string,
  ): Promise<z.infer<typeof FriendRequestSchema>[]> {
    return this.friendRequestsService.getReceivedInvites(userId);
  }

  @Get('sent')
  getSentInvites(
    @GetUser('id') userId: string,
  ): Promise<z.infer<typeof FriendRequestSchema>[]> {
    return this.friendRequestsService.getSentInvites(userId);
  }

  @Post('accept/:inviteId')
  acceptInvite(@Param('inviteId') inviteId: string): Promise<void> {
    return this.friendRequestsService.acceptInvite(inviteId);
  }

  @Delete('refuse/:inviteId')
  refuseInvite(@Param('inviteId') inviteId: string): Promise<void> {
    return this.friendRequestsService.refuseInvite(inviteId);
  }
}
