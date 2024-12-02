import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
    constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

    async addValueToList(key: string, values: string[]): Promise<number> {
        return await this.redisClient.rpush(key, ...values);
    }

    async getValueFromList(key: string): Promise<string[]> {
        return await this.redisClient.lrange(key, 0, -1);
    }

    async removeValueFromList(key: string, value: string): Promise<number> {
        return await this.redisClient.lrem(key, 0, value);
    }

    async setValue(key: string, value: string): Promise<void> {
        await this.redisClient.set(key, value);
    }

    async getValue(key: string): Promise<string | null> {
        return this.redisClient.get(key);
    }

    async removeValue(key: string): Promise<void> {
        await this.redisClient.del(key);
    }
}