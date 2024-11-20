import {
    applyDecorators,
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    NestInterceptor,
    SetMetadata,
    UseInterceptors
} from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { catchError, delay, retryWhen, scan } from 'rxjs/operators'
import { KafkaService } from '@src/infrastructure/kafka/kafka.service'
import { KAFKA_TOPIC_DQL_ENUM } from '@src/infrastructure/kafka/kafka.topic.enum'
import { Reflector } from '@nestjs/core'

@Injectable()
export class CustomRetryInterceptor implements NestInterceptor {
    constructor(
        @Inject(KafkaService) private readonly kafkaService: KafkaService,
        private readonly reflector: Reflector
    ) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const retries = this.reflector.get<number, Symbol>(
            KAFKA_RETRY_META_KEY,
            context.getHandler()
        )
        const delayTime = this.reflector.get<number, Symbol>(
            KAFKA_DELAY_META_KEY,
            context.getHandler()
        )
        const dlqTopic = this.reflector.get<KAFKA_TOPIC_DQL_ENUM, Symbol>(
            KAFKA_DLQ_TOPIC_META_KEY,
            context.getHandler()
        )

        return next.handle().pipe(
            retryWhen(errors =>
                errors.pipe(
                    scan((acc, error) => {
                        if (acc >= retries) {
                            // Send message to DLQ after exhausting retries
                            const kafkaContext = context.switchToRpc().getContext()
                            const message = kafkaContext.getMessage()
                            this.sendToDLQ(dlqTopic, message) // Send message to DLQ

                            throw error // Exceeds max retries, stop retrying
                        }
                        console.log(`Retry attempt ${acc + 1} failed. Retrying...`)
                        return acc + 1
                    }, 0),
                    delay(delayTime) // Delay between retry attempts
                )
            ),
            catchError((error) => {
                console.error('Failed after max retries. Sent to DLQ:', error)
                return throwError(error) // Rethrow the error after handling
            })
        )
    }

    // Send message to DLQ topic
    private async sendToDLQ(dlqTopic: KAFKA_TOPIC_DQL_ENUM, message: any) {
        try {
            await this.kafkaService.produceEmit(dlqTopic, {
                value: message.value,       // Original message content
                headers: {
                    ...message.headers,       // Preserve original headers, if any
                    dlqReason: 'Max retries exceeded', // Custom header with failure reason
                },
                topic: message.topic,       // Original topic for reference
                partition: message.partition // Original partition if needed
            })
            console.log(`Message sent to DLQ topic (${dlqTopic}):`, message)
        } catch (dlqError) {
            console.error('Failed to send message to DLQ:', dlqError)
        }
    }
}

export interface KafkaRetryOptions {
    retries: number;
    delayTime: number;
    dlqTopic: KAFKA_TOPIC_DQL_ENUM;
}

const KAFKA_RETRY_META_KEY = Symbol('KAFKA_RETRY_META_KEY')
const KAFKA_DELAY_META_KEY = Symbol('KAFKA_DELAY_META_KEY')
const KAFKA_DLQ_TOPIC_META_KEY = Symbol('KAFKA_DLQ_TOPIC_META_KEY')

export function KafkaRetry(options: KafkaRetryOptions) {
    return applyDecorators(
        UseInterceptors(CustomRetryInterceptor),
        SetMetadata(KAFKA_RETRY_META_KEY, options.retries),
        SetMetadata(KAFKA_DELAY_META_KEY, options.delayTime),
        SetMetadata(KAFKA_DLQ_TOPIC_META_KEY, options.dlqTopic)
    )
}
