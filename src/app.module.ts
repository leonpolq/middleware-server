import { Module } from '@nestjs/common'
import { GameModule } from '@src/application/game/game.module'
import { CommonModule } from '@src/common.module'
import { AuthModule } from './auth/auth.module'
import { RedisModule } from '@src/infrastructure/redis/redis.module'
import { RabbitMQModule } from '@src/infrastructure/rabbitmq/rabbitmq.module'
import { UserModule } from '@src/application/user/user.module'

@Module({
    imports: [
        GameModule,
        UserModule,

        CommonModule,
        AuthModule,
        RedisModule,
        RabbitMQModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
