import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthRegisterPostBody,
  AuthRegisterPostBodySchema,
  AuthRegisterPostResponse,
} from 'target-hunt-bridge';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(
    @Body() body: AuthRegisterPostBody,
  ): Promise<AuthRegisterPostResponse> {
    const validBody = AuthRegisterPostBodySchema.parse(body);
    return this.authService.register(validBody);
  }
}
