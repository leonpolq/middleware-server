import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { WebsocketGatewayDecorator } from './decorators/websocket-gateway.decorator'
import { RedisService } from '@src/infrastructure/redis/redis.service'
import { JwtPureAuthService } from '@src/auth/services/jwt-pure-auth.service'

@WebsocketGatewayDecorator()
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server // Server instance for broadcasting messages
    private logger: Logger = new Logger('ChatGateway')

    constructor(
        private readonly redisService: RedisService,
        private readonly jwtPureService: JwtPureAuthService,
    ) {}

    afterInit(server: Server) {
        this.logger.log('Initialized socket')
    }

    async handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`)

        const user = await this.jwtPureService.authenticate(client, 'custom-ws-jwt')

        this.logger.log(`User ${user.id}`)

        console.log('Headers', client.handshake.headers)

        await this.redisService.addValueToList(user.id, [client.id])

        client.emit('welcome', { message: 'Welcome to the chat!' }) // Send a welcome message
    }

    async handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`)

        const user = await this.jwtPureService.authenticate(client, 'custom-ws-jwt')

        await this.redisService.removeValueFromList(user.id, client.id)
    }
}
