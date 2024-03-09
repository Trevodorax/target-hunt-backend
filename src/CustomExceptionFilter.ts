import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';

@Catch(HttpException, ZodError)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 422;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      errors: exception instanceof ZodError ? exception.errors : undefined,
    });
  }
}
