import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  LoggerService,
} from '@nestjs/common';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus() || 500;
    const message = exception.message || 'Internal Server Error';
    this.logger.error(message, exception.stack);
    response.status(status).json({
      status,
      message,
      timeTamp: new Date().toISOString(),
      error: request.url,
    });
  }
}
