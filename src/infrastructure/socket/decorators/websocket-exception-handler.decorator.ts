import { applyDecorators, ArgumentsHost, Catch, HttpException, Logger, UseFilters } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'
import { Socket } from 'socket.io'

@Catch(WsException, HttpException)
export class WsExceptionFilter {
    logger = new Logger('WsExceptionFilter');

    public catch(exception: HttpException | WsException, host: ArgumentsHost) {
        this.logger.error(exception.message, exception.stack)
        const client = host.switchToWs().getClient()
        this.handleError(client, exception)
    }

    public handleError(client: Socket, exception: HttpException | WsException) {
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const response = exception.getResponse();
            client.emit('error', {
                status,
                message: response,
            });
        } else {
            client.emit('error', {
                message: exception.message,
            });
        }
    }
}

export function WebsocketExceptionHandler() {
    return applyDecorators(
        UseFilters(WsExceptionFilter)
    )
}