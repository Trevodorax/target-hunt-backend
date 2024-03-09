import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/CreateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOneById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async create(user: CreateUserDto): Promise<User | null> {
    try {
      const result = await this.userRepository.insert(user);
      const userId = result.generatedMaps[0].id;
      const newUser = await this.userRepository.findOneBy({ id: userId });
      return newUser;
    } catch (e) {
      return null;
    }
  }
}
