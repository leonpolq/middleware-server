import { applyDecorators, BadRequestException, Logger, UsePipes, ValidationPipe } from '@nestjs/common'
import { WebSocketGateway } from '@nestjs/websockets'

export function ValidationDecorator() {
    return applyDecorators(
        UsePipes(new ValidationPipe({
            exceptionFactory: (errors) => {
                // Log the errors for debugging
                const logger = new Logger('ValidationPipe 1');
                errors.forEach((error) => {
                    logger.error(`Validation failed on ${error.property}: ${JSON.stringify(error.constraints)}`);
                });

                return new BadRequestException(errors);
            },
        })),
    )
}
