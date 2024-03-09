import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthLoginPostBody, AuthRegisterPostBody } from 'target-hunt-bridge';

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
      passwordHash: body.user.password, // TODO: store password hash instead
    });

    console.log('created user', user);

    if (!user) {
      throw new UnprocessableEntityException();
    }

    const payload = { email: user.email };
    return { token: await this.jwtService.signAsync(payload) };
  }

  async login(body: AuthLoginPostBody) {
    const user = await this.userService.findOneByEmail(body.credentials.email);
    console.log('trying to log in with user ', user);
    // TODO: compare with hash instead
    if (user?.passwordHash !== body.credentials.password) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
