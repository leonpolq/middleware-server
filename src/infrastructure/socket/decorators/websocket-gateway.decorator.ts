import { applyDecorators } from '@nestjs/common'
import { WebSocketGateway } from '@nestjs/websockets'

export function WebsocketGatewayDecorator() {
    return applyDecorators(
        WebSocketGateway({ namespace: '/socket', cors: '*' }),
    )
}
