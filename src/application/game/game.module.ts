import { Module } from '@nestjs/common'
import { GameStartGateway } from './commands/game-start/game-start.gateway'
import { KafkaModule } from '@src/infrastructure/kafka/kafka.module'
import { RabbitMQModule } from '@src/infrastructure/rabbitmq/rabbitmq.module'

@Module({
    imports: [
        KafkaModule,
        RabbitMQModule,
    ],
    providers: [
        GameStartGateway,
    ],
})
export class GameModule {
}
