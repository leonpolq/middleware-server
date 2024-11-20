import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class KafkaResponseTimeoutInterceptor
    implements NestInterceptor<Promise<any>>
{
    private readonly timeout: number;

    constructor(private readonly configService: ConfigService) {
        this.timeout = 30000 // 30s
    }

    async intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Promise<Observable<Promise<any> | string>> {
        return next.handle().pipe(
            timeout(this.timeout),
            catchError((err) => {
                if (err instanceof TimeoutError) {
                    throw new RpcException({
                        statusCode: 400,
                        message: 'http.clientError.requestTimeOut',
                    });
                }
                return throwError(() => err);
            })
        );

        return next.handle();
    }
}
