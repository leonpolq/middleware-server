import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, Logger } from '@nestjs/common';
import { ValidationError } from 'class-validator';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ValidationExceptionFilter.name);

    catch(exception: BadRequestException, host: ArgumentsHost) {
        this.logger.log('ValidationExceptionFilter', exception);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();

        const responseBody = exception.getResponse() as any;
        if (responseBody.message && Array.isArray(responseBody.message)) {
            responseBody.message.forEach((error: ValidationError) => {
                this.logger.error(`Validation error: ${JSON.stringify(error)}`);
            });
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: responseBody.message,
        });
    }
}