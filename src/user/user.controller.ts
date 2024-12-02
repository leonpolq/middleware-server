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
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        console.log('Before...');
        return next.handle().pipe(map(data => ({ data })));
    }
}

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/user')
export class UserController {
    constructor(
        private readonly redisService: RedisService,
    ) {

    }

    @Get()
    list(@CurrentUser() user: CurrentUserInterface) {
        console.log("user",user)

        return {user, }
    }
}