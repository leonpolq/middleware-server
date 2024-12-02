import { Module } from '@nestjs/common'
import { GameModule } from '@src/application/game/game.module'
import { CommonModule } from '@src/common.module'
import { AuthModule } from './auth/auth.module'
import { UserModule } from './user/user.module'
import { RedisModule } from '@src/infrastructure/redis/redis.module'
import { RabbitMQModule } from '@src/infrastructure/rabbitmq/rabbitmq.module'

@Module({
    imports: [GameModule, CommonModule, AuthModule, UserModule, RedisModule, RabbitMQModule],
    controllers: [],
    providers: [],
})
export class AppModule {
}
