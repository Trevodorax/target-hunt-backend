import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthLoginPostBody, AuthRegisterPostBody } from 'target-hunt-bridge';
import { User } from 'src/user/user.entity';
import { UserPayload } from './decorators/user.decorator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
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
    return { token: await this.jwtService.signAsync(payload) };
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
      token: await this.jwtService.signAsync(payload),
    };
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
