import { WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { Injectable, Logger } from '@nestjs/common'
import { WebsocketGatewayDecorator } from '@src/infrastructure/socket/decorators/websocket-gateway.decorator'
import { WebsocketExceptionHandler } from '@src/infrastructure/socket/decorators/websocket-exception-handler.decorator'
import { v4 as uuidv4 } from 'uuid'
import { CurrentUserInterface } from '@src/utils/current-user.decorator'
import { RedisService } from '@src/infrastructure/redis/redis.service'
import { RabbitmqService } from '@src/infrastructure/rabbitmq/rabbitmq.service'
import { RABBITMQ_EXCHANGE_ENUM, RABBITMQ_ROUTING_KEY_ENUM } from '@src/infrastructure/rabbitmq/rabbitmq.queue.enum'
import { EntityIdDTO } from '@src/shared-interfaces/websocket/EntityIdDTO'

@Injectable()
export class UserCreateService {
    private readonly logger: Logger = new Logger('UserCreateService')

    constructor(
        private readonly rabbitMQService: RabbitmqService
    ) {}

    async create(user: CurrentUserInterface) {
        const correlationId = uuidv4()
        const data = {
            id: user.id,
            email: user.email,
            firstName: user.email,
            lastName: user.email,
            role: user.email,
            correlationId,
        }

        const response = await this.rabbitMQService
            .requestRPC<typeof data, EntityIdDTO>(
                RABBITMQ_EXCHANGE_ENUM.USER,
                RABBITMQ_ROUTING_KEY_ENUM.USER_GET,
                data,
                user.id,
            )

        this.logger.log(`Response from RabbitMQ: ${JSON.stringify(response)}`)
    }
}
