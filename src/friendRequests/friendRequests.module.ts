import { Module } from '@nestjs/common';
import { FriendRequestsController } from './friendRequests.controller';
import { FriendRequestsService } from './friendRequests.service';
import { FriendsModule } from 'src/friends/friends.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequest } from './entities/friendRequest.entity';

@Module({
  imports: [FriendsModule, TypeOrmModule.forFeature([FriendRequest])],
  controllers: [FriendRequestsController],
  providers: [FriendRequestsService],
})
export class FriendRequestsModule {}
