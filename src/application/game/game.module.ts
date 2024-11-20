import { Module } from '@nestjs/common'
import { GameStartGateway } from './commands/game-start/game-start.gateway'
import { KafkaModule } from '@src/infrastructure/kafka/kafka.module'

@Module({
    imports: [
        KafkaModule,
    ],
    providers: [
        GameStartGateway,
    ],
})
export class GameModule {
}
