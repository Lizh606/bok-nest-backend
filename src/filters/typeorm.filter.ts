import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeormFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let code = 500;
    if (exception instanceof QueryFailedError) {
      code = exception.driverError.errno;
    }
    response.status(500).json({
      status: code,
      message: exception.message,
      timeTamp: new Date().toISOString(),
      error: request.url,
    });
  }
}
