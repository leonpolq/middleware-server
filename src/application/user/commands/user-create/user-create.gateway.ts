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
import { WebsocketEventNames } from '@src/shared-interfaces/websocket/WebsocketEventNames'
import { EntityIdDTO } from '@src/shared-interfaces/websocket/EntityIdDTO'
import {
    UserCreateLightSocketRequestDto, UserCreateSocketRequestDto
} from '@src/application/user/commands/user-create/dtos/user-create.socket.request.dto'

@WebsocketGatewayDecorator()
@WebsocketExceptionHandler()
export class UserCreateGateway {
    @WebSocketServer() server: Server

    private readonly logger: Logger = new Logger('ChatGateway')

    constructor(
        private readonly redisService: RedisService,
        private readonly rabbitMQService: RabbitmqService
    ) {}

    @SubscribeMessage(WebsocketEventNames.userCreate)
    @ValidationDecorator()
    @UseGuards(WsAuthGuard)
    async handleMessage(
        @CurrentUser() user: CurrentUserInterface,
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: UserCreateSocketRequestDto
    ) {
        console.log('USER', '!!!')
        const correlationId = uuidv4()
        const data = {
            id: user.id,
            correlationId,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            role: payload.role,
        }
        const response = await this.rabbitMQService
            .requestRPC<typeof data, EntityIdDTO>(
                RABBITMQ_EXCHANGE_ENUM.USER,
                RABBITMQ_ROUTING_KEY_ENUM.USER_CREATE,
                data,
                user.id,
            )

        this.logger.log(`Response from RabbitMQ: ${JSON.stringify(response)}`)

        return {
            success: true,
            data: response,
        }
    }
}
