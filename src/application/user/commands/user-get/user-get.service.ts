import { CallHandler, Controller, ExecutionContext, Get, Injectable, NestInterceptor, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser, CurrentUserInterface } from '@src/utils/current-user.decorator'
import { RedisService } from '@src/infrastructure/redis/redis.service'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

export interface Response<T> {
    data: T;
}

@Injectable()
export class UserGetService {
    get(user: CurrentUserInterface) {
        console.log('user', user)

        return { user }
    }
}