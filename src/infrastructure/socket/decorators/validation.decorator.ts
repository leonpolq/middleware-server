import { applyDecorators, BadRequestException, Logger, UsePipes, ValidationPipe } from '@nestjs/common'
import { WebSocketGateway } from '@nestjs/websockets'

export function ValidationDecorator() {
    return applyDecorators(
        UsePipes(new ValidationPipe({
            exceptionFactory: (errors) => {
                const logger = new Logger('ValidationPipe');

                errors.forEach((error) => {
                    logger.error(`Validation failed on ${error.property}: ${JSON.stringify(error.constraints)} value "${error.value}"`);
                });

                return new BadRequestException(errors);
            },
        })),
    )
}
