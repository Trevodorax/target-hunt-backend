import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthLoginPostBody,
  AuthLoginPostBodySchema,
  AuthLoginPostResponse,
  AuthRegisterPostBody,
  AuthRegisterPostBodySchema,
  AuthRegisterPostResponse,
} from 'target-hunt-bridge';
import { Public } from './decorators/public.decorator';
import { GetUser, UserPayload } from './decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  register(
    @Body() body: AuthRegisterPostBody,
  ): Promise<AuthRegisterPostResponse> {
    const validBody = AuthRegisterPostBodySchema.parse(body); // TODO: add ZodError to the exception catcher to avoid 500
    return this.authService.register(validBody);
  }

  @Public()
  @Post('login')
  login(@Body() body: AuthLoginPostBody): Promise<AuthLoginPostResponse> {
    const validBody = AuthLoginPostBodySchema.parse(body); // TODO: add ZodError to the exception catcher to avoid 500
    return this.authService.login(validBody);
  }

  @Get('me')
  protected(@GetUser() user: UserPayload): UserPayload {
    return user;
  }
}
