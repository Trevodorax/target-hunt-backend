import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthLoginPostBody,
  AuthLoginPostBodySchema,
  AuthLoginPostResponse,
  AuthMeGetResponse,
  AuthMePatchBody,
  AuthMePatchBodySchema,
  AuthMePatchResponse,
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
    const validBody = AuthRegisterPostBodySchema.parse(body);
    return this.authService.register(validBody);
  }

  @Public()
  @Post('login')
  login(@Body() body: AuthLoginPostBody): Promise<AuthLoginPostResponse> {
    const validBody = AuthLoginPostBodySchema.parse(body);
    return this.authService.login(validBody);
  }

  @Get('me')
  me(@GetUser() user: UserPayload): AuthMeGetResponse {
    return user;
  }

  @Patch('me')
  editMyInfo(
    @GetUser('id') id: string,
    @Body() body: AuthMePatchBody,
  ): Promise<AuthMePatchResponse> {
    return this.authService.editMyInfo(id, AuthMePatchBodySchema.parse(body));
  }
}
