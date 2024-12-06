import { Logger, Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RabbitmqService } from '@src/infrastructure/rabbitmq/rabbitmq.service'
import { AmqpConnection, RabbitMQModule as RabbitMQModuleLIB } from '@golevelup/nestjs-rabbitmq'
import { RABBITMQ_EXCHANGE_ENUM, RABBITMQ_ROUTING_KEY_ENUM } from '@src/infrastructure/rabbitmq/rabbitmq.queue.enum'

@Module({
    imports: [
        ConfigModule,
        RabbitMQModuleLIB.forRoot(RabbitMQModuleLIB, {
            exchanges: [
                {
                    name: RABBITMQ_EXCHANGE_ENUM.GAME,
                    type: 'topic',
                },
                {
                    name: RABBITMQ_EXCHANGE_ENUM.TEST,
                    type: 'topic',
                }
            ],
            uri: 'amqp://user:password@localhost:5672',
            channels: {
                'channel-1': {
                    prefetchCount: 15,
                    default: true,
                },
                'channel-2': {
                    prefetchCount: 2,
                },
            },
        }),
        RabbitMQModule,
    ],
    providers: [
        RabbitmqService,
    ],
    exports: [
        RabbitmqService,
    ],
})
export class RabbitMQModule implements OnModuleInit {
    private readonly logger = new Logger(RabbitMQModule.name)

    constructor(
        private readonly amqpConnection: AmqpConnection,
    ) {}

    async onModuleInit() {
        this.logger.log('RABBITMQ Module')

        this.logger.log(this.amqpConnection)

        await Promise.all(([
                [
                    RABBITMQ_EXCHANGE_ENUM.GAME,
                    [
                        RABBITMQ_ROUTING_KEY_ENUM.GAME_CREATE,
                        RABBITMQ_ROUTING_KEY_ENUM.GAME_START,
                        RABBITMQ_ROUTING_KEY_ENUM.GAME_PAUSE,
                        ''
                    ]
                ],
                [
                    RABBITMQ_EXCHANGE_ENUM.TEST,
                    [
                        ''
                    ]
                ],
            ] as [RABBITMQ_EXCHANGE_ENUM, [RABBITMQ_ROUTING_KEY_ENUM | '']][]).map(async ([exchange, routingKeys]) => {
                await Promise.all(
                    routingKeys.map(async (routingKey) => {
                        let queue = `${exchange}.kafka`

                        await this.amqpConnection.channel.assertQueue(queue, { durable: true })
                        await this.amqpConnection.channel.bindQueue(queue, exchange, routingKey)
                    })
                )
            })
        )
    }
}