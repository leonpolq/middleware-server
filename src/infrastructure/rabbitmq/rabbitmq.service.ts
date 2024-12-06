import { Injectable, Logger, } from '@nestjs/common'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { RABBITMQ_EXCHANGE_ENUM, RABBITMQ_ROUTING_KEY_ENUM } from '@src/infrastructure/rabbitmq/rabbitmq.queue.enum'
import { Buffer } from 'buffer'
// import {Buffer from 'buffer'

class ExpectedReturnType {
}

@Injectable()
export class RabbitmqService {
    private readonly timeout: number
    protected logger = new Logger(RabbitmqService.name)

    constructor(
        private readonly amqpConnection: AmqpConnection,
    ) {
        this.timeout = 1000
    }

    async onModuleInit() {
        this.logger.log('RABBITMQ Client Connected')
    }

    async requestRPC<T, N>(
        exchange: RABBITMQ_EXCHANGE_ENUM,
        routingKey: RABBITMQ_ROUTING_KEY_ENUM,
        data: T,
        userId: string,
    ): Promise<N> {
        await this.amqpConnection.channel
            .assertQueue('', { exclusive: true })
        const response = await this.amqpConnection
            .request<ExpectedReturnType>({
                exchange: exchange,
                routingKey: routingKey,
                payload: data,
                timeout: 100000000,
                headers: {
                    'x-user-id': userId,
                }
            })

        console.log('response', response)

        return response
    }

    async publish(
        exchange: RABBITMQ_EXCHANGE_ENUM,
        routingKey: RABBITMQ_ROUTING_KEY_ENUM | '',
        data: any,
    ) {
        let content = Buffer.from(JSON.stringify(data))

        console.log('publish content', content)
        console.log('publish content', data)

        await this.amqpConnection
            .channel
            .publish(
                exchange,
                routingKey,
                content,
            )
    }
}
