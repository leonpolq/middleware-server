import { Global, Module } from '@nestjs/common'
import Redis from 'ioredis'
import { RedisService } from '@src/infrastructure/redis/redis.service'

@Global()
@Module({
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: () => {
                return new Redis({ host: '127.0.0.1', port: 6379 })
            },
        },
        RedisService,
    ],
    exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {
}
