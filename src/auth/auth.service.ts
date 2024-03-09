import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthRegisterPostBody } from 'target-hunt-bridge';

@Injectable()
export class AuthService {
  constructor(private usersService: UserService) {}

  async register(body: AuthRegisterPostBody) {
    const user = await this.usersService.create({
      pseudo: body.user.pseudo,
      email: body.user.email,
      passwordHash: body.user.password, // TODO: store password hash instead
    });

    return { token: `user with id ${user.id}` };
  }
}
