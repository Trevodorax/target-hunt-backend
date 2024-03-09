import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface UserPayload {
  id: string;
  email: string;
  pseudo: string;
}

export const GetUser = createParamDecorator(
  (prop: string | undefined, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    if (prop) {
      return request.user[prop];
    }
    return request.user;
  },
);
