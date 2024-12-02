import { Logger, Module, OnModuleInit } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RabbitmqService } from '@src/infrastructure/rabbitmq/rabbitmq.service'
import { AmqpConnection, RabbitMQModule as RabbitMQModuleLIB } from '@golevelup/nestjs-rabbitmq'
import { RABBITMQ_EXCHANGE_ENUM } from '@src/infrastructure/rabbitmq/rabbitmq.queue.enum'

@Module({
    imports: [
        ConfigModule,
        RabbitMQModuleLIB.forRoot(RabbitMQModuleLIB, {
            exchanges: [
                {
                    name: RABBITMQ_EXCHANGE_ENUM.GAME_START,
                    type: 'topic',
                },
                {
                    name: RABBITMQ_EXCHANGE_ENUM.TEST_RUN,
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

        await Promise.all([
            RABBITMQ_EXCHANGE_ENUM.GAME_START,
            RABBITMQ_EXCHANGE_ENUM.TEST_RUN,
        ].map(async (exchange: RABBITMQ_EXCHANGE_ENUM) => {
            let queue = `${exchange}.kafka`

            this.logger.log('queue', queue)

            await this.amqpConnection.channel.assertQueue(queue, { durable: true })
            await this.amqpConnection.channel.bindQueue(queue, exchange, '')
        }))
    }
}