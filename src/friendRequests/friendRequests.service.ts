import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friendRequest.entity';
import { Repository } from 'typeorm';
import { FriendsService } from 'src/friends/friends.service';
import { User } from 'src/users/users.entity';
import { userToMinimalUser } from 'src/users/dto/MinimalUser.dto';
import { z } from 'zod';
import { FriendRequestSchema } from 'target-hunt-bridge';

@Injectable()
export class FriendRequestsService {
  constructor(
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    private friendsService: FriendsService,
  ) {}
  async sendInvite(senderId: string, receiverId: string): Promise<void> {
    const friendRequest = new FriendRequest();
    friendRequest.sender = { id: senderId } as User;
    friendRequest.receiver = { id: receiverId } as User;

    await this.friendRequestRepository.save(friendRequest);
  }

  async getReceivedInvites(
    userId: string,
  ): Promise<z.infer<typeof FriendRequestSchema>[]> {
    const receivedFriendRequests = await this.friendRequestRepository.find({
      where: { receiver: { id: userId } },
      relations: ['sender', 'receiver'],
    });

    return receivedFriendRequests.map((request) => ({
      id: request.id,
      receiver: userToMinimalUser(request.receiver),
      sender: userToMinimalUser(request.sender),
    }));
  }

  async getSentInvites(
    userId: string,
  ): Promise<z.infer<typeof FriendRequestSchema>[]> {
    const sentFriendRequests = await this.friendRequestRepository.find({
      where: { sender: { id: userId } },
      relations: ['sender', 'receiver'],
    });

    return sentFriendRequests.map((request) => ({
      id: request.id,
      receiver: userToMinimalUser(request.receiver),
      sender: userToMinimalUser(request.sender),
    }));
  }

  async acceptInvite(inviteId: string): Promise<void> {
    const invite = await this.friendRequestRepository.findOne({
      where: { id: inviteId },
      relations: ['sender', 'receiver'],
    });
    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    this.friendsService.addFriend(invite.receiver.id, invite.sender.id);
    await this.friendRequestRepository.remove(invite);
  }

  async refuseInvite(inviteId: string): Promise<void> {
    const invite = await this.friendRequestRepository.findOne({
      where: { id: inviteId },
    });
    if (!invite) {
      throw new NotFoundException('Invite not found');
    }
    await this.friendRequestRepository.remove(invite);
  }
}
