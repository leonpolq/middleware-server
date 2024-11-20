import { SubscribeMessage, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger, UseGuards } from '@nestjs/common'
import { WebsocketGatewayDecorator } from '@src/infrastructure/socket/decorators/websocket-gateway.decorator'
import { ValidationDecorator } from '@src/infrastructure/socket/decorators/validation.decorator'
import { WebsocketExceptionHandler } from '@src/infrastructure/socket/decorators/websocket-exception-handler.decorator'
import { KafkaService } from '@src/infrastructure/kafka/kafka.service'
import { KAFKA_TOPIC_ALL_ENUM } from '@src/infrastructure/kafka/kafka.topic.enum'
import { StartGameSocketRequestDto } from '@src/application/game/commands/game-start/dtos/game-start.socket.request.dto'
import { v4 as uuidv4 } from 'uuid';
import { AuthGuard } from '@nestjs/passport'
import { WsAuthGuard } from '@src/auth/guards/ws-auth.guard'

@WebsocketGatewayDecorator()
@WebsocketExceptionHandler()
export class GameStartGateway {
    @WebSocketServer() server: Server

    private readonly logger: Logger = new Logger('ChatGateway')

    constructor(
        private readonly kafkaService: KafkaService
    ) {}

    @SubscribeMessage('game-start')
    @ValidationDecorator()
    @UseGuards(WsAuthGuard)
    async handleMessage(client: Socket, payload: StartGameSocketRequestDto) {
        this.logger.log(`Message from ${payload} and stringified: ${JSON.stringify(payload)}`)

        // generate new uuid
        const correlationId = uuidv4();

        const data = {
            ...payload,
            correlationId,
        }
        await this.kafkaService.produceSend(KAFKA_TOPIC_ALL_ENUM.GAME_START, data)

        this.server.to(client.id).emit('game-started', { message: 'Game started!' }) // Send a welcome message

        this.server.emit('to-all', JSON.stringify(payload)) // Broadcast the message to all clients
    }
}
