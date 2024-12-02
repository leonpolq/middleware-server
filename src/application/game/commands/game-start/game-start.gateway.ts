import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger, UseGuards } from '@nestjs/common'
import { WebsocketGatewayDecorator } from '@src/infrastructure/socket/decorators/websocket-gateway.decorator'
import { ValidationDecorator } from '@src/infrastructure/socket/decorators/validation.decorator'
import { WebsocketExceptionHandler } from '@src/infrastructure/socket/decorators/websocket-exception-handler.decorator'
import { StartGameSocketRequestDto } from '@src/application/game/commands/game-start/dtos/game-start.socket.request.dto'
import { v4 as uuidv4 } from 'uuid'
import { WsAuthGuard } from '@src/auth/guards/ws-auth.guard'
import { CurrentUser, CurrentUserInterface } from '@src/utils/current-user.decorator'
import { RedisService } from '@src/infrastructure/redis/redis.service'
import { GmailBasedValidationPipe, LeStartValidationPipe } from '@src/utils/gmail-based.validation.pipe'
import { RabbitmqService } from '@src/infrastructure/rabbitmq/rabbitmq.service'
import { RABBITMQ_EXCHANGE_ENUM, RABBITMQ_ROUTING_KEY_ENUM } from '@src/infrastructure/rabbitmq/rabbitmq.queue.enum'

@WebsocketGatewayDecorator()
@WebsocketExceptionHandler()
export class GameStartGateway {
    @WebSocketServer() server: Server

    private readonly logger: Logger = new Logger('ChatGateway')

    constructor(
        private readonly redisService: RedisService,
        private readonly rabbitMQService: RabbitmqService
    ) {}

    @SubscribeMessage('game-start')
    @ValidationDecorator()
    @UseGuards(WsAuthGuard)
    async handleMessage(
        @CurrentUser(new GmailBasedValidationPipe(), new LeStartValidationPipe())
            user: CurrentUserInterface,
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: StartGameSocketRequestDto
    ) {
        this.logger.log(`User from JWT: ${user}`)
        this.logger.log(`Message from ${payload} and stringified: ${JSON.stringify(payload)}`)

        const correlationId = uuidv4()

        const data = {
            ...payload,
            correlationId,
        }
        const redisClientIds = await this.redisService.getValueFromList(user.id)
        console.log('redisClientIds', redisClientIds)

        this.server.to(redisClientIds).emit('game-started', payload)

        await this.rabbitMQService
            .requestRPC(
                RABBITMQ_EXCHANGE_ENUM.GAME_START,
                RABBITMQ_ROUTING_KEY_ENUM.GAME_START,
                data,
            )

        // await this.kafkaService.produceSend(KAFKA_TOPIC_ALL_ENUM.GAME_START, data)

        // await this.rabbitMQService
        //     .request(
        //         RABBITMQ_EXCHANGE_ENUM.GAME_START,
        //         RABBITMQ_ROUTING_KEY_ENUM.GAME_START,
        //         data,
        //     )

        // await this.rabbitMQService
        //     .publish(
        //         RABBITMQ_EXCHANGE_ENUM.GAME_START,
        //         '',
        //         data,
        //     )
        // await this.rabbitMQService
        //     .publish(
        //         RABBITMQ_EXCHANGE_ENUM.TEST_RUN,
        //         '',
        //         data,
        //     )

        this.server.to(client.id).emit('game-started', { message: 'Game started!' }) // Send a welcome message
    }
}
