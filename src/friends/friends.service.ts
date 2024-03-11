import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllFriends(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });

    return user?.friends.map(({ passwordHash: _ignored, ...rest }) => rest); // eslint-disable-line
  }

  async addFriend(userId: string, friendId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });
    const friend = await this.userRepository.findOne({
      where: { id: friendId },
      relations: ['friends'],
    });

    if (!user || !friend) {
      throw new NotFoundException('User or friend not found.');
    }

    if (!user.friends.some((f) => f.id === friend.id)) {
      user.friends.push(friend);
    }

    if (!friend.friends.some((f) => f.id === user.id)) {
      friend.friends.push(user);
    }

    await this.userRepository.save(user);
    await this.userRepository.save(friend);
  }

  async removeFriend(userId: string, friendId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['friends'],
    });
    const friend = await this.userRepository.findOne({
      where: { id: friendId },
      relations: ['friends'],
    });
    if (!user || !friend) {
      throw new NotFoundException('User or friend not found.');
    }
    user.friends = user.friends.filter((f) => f.id !== friend.id);
    friend.friends = friend.friends.filter((f) => f.id !== user.id);
    await this.userRepository.save(user);
    await this.userRepository.save(friend);
  }
}
