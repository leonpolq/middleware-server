import {
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    WebSocketServer
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger, UseGuards } from '@nestjs/common'
import { WebsocketGatewayDecorator } from './decorators/websocket-gateway.decorator'
import { WsAuthGuard } from '@src/auth/guards/ws-auth.guard'

@WebsocketGatewayDecorator()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server // Server instance for broadcasting messages
    private logger: Logger = new Logger('ChatGateway')

    afterInit(server: Server) {
        this.logger.log('Initialized')
    }

    @UseGuards(WsAuthGuard)
    handleConnection(@ConnectedSocket() client: Socket) {
        this.logger.log(`Client connected: ${client.id}`)
        console.log('Headers', client.handshake.headers) // Access the headers
        client.emit('welcome', { message: 'Welcome to the chat!' }) // Send a welcome message
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`)
    }
}
