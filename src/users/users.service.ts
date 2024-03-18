import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/CreateUser.dto';
import { EditUserDto } from './dto/EditUser.dto';
import { SearchUserDto } from './dto/SearchUser.dto';
import { userToMinimalUser } from './dto/MinimalUser.dto';

@Injectable()
export class UsersService {
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

  async remove(id: string): Promise<void> {
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

  async edit(id: string, data: EditUserDto): Promise<User> {
    // find the user by id
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new Error('User not found');
    }

    // check if email is provided and unique (if email is in data)
    if (data.email) {
      const emailExists = await this.userRepository.findOneBy({
        email: data.email,
      });
      if (emailExists && emailExists.id !== id) {
        throw new UnprocessableEntityException('Email already in use');
      }
      user.email = data.email;
    }

    // update pseudo if provided
    if (data.pseudo) {
      user.pseudo = data.pseudo;
    }

    // hash password if provided
    if (data.passwordHash) {
      // assume a hashing function is available
      user.passwordHash = data.passwordHash;
    }

    // save the updated user info
    return this.userRepository.save(user);
  }

  async search(search: SearchUserDto) {
    const matchingUsers = await this.userRepository.find({
      where: [
        { pseudo: Like(`%${search.search}%`) },
        { email: Like(`%${search.search}%`) },
      ],
    });

    return matchingUsers.map(userToMinimalUser);
  }
}
