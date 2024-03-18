import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import {
  AuthLoginPostBody,
  AuthMePatchBody,
  AuthMePatchResponse,
  AuthRegisterPostBody,
} from 'target-hunt-bridge';
import { User } from 'src/users/users.entity';
import { UserPayload } from './decorators/user.decorator';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { EditUserDto } from 'src/users/dto/EditUser.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(body: AuthRegisterPostBody) {
    const user = await this.userService.create({
      pseudo: body.user.pseudo,
      email: body.user.email,
      passwordHash: await passwordToHash(body.user.password),
    });

    if (!user) {
      throw new UnprocessableEntityException();
    }

    const payload = userToPayload(user);
    return {
      token: await this.jwtService.signAsync(payload, {
        expiresIn: '24h',
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
    };
  }

  async login(body: AuthLoginPostBody) {
    const user = await this.userService.findOneByEmail(body.credentials.email);

    // No matching email
    if (!user) {
      throw new UnauthorizedException("Email doesn't exist");
    }

    // password don't match
    if (!(await bcrypt.compare(body.credentials.password, user.passwordHash))) {
      throw new UnauthorizedException("Password doesn't match");
    }
    const payload = userToPayload(user);
    return {
      token: await this.jwtService.signAsync(payload, {
        expiresIn: '24h',
        secret: this.configService.get<string>('JWT_SECRET'),
      }),
    };
  }

  async editMyInfo(
    userId: string,
    body: AuthMePatchBody,
  ): Promise<AuthMePatchResponse> {
    const newInfo: EditUserDto = {
      pseudo: body.pseudo,
      email: body.email,
      passwordHash: body.password
        ? await passwordToHash(body.password)
        : undefined,
    };

    return this.userService.edit(userId, newInfo);
  }
}

const userToPayload = (user: User): UserPayload => {
  const payload = {
    id: user.id,
    email: user.email,
    pseudo: user.pseudo,
  };

  return payload;
};

const passwordToHash = async (password: string): Promise<string> => {
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(password, saltOrRounds);
  return hash;
};
