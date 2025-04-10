import {
    applyDecorators,
    createParamDecorator,
    ExecutionContext,
    UseFilters,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import {
    KafkaContext,
    MessagePattern,
    Payload,
    Transport,
} from '@nestjs/microservices';
import { KafkaResponseInterceptor } from '@src/infrastructure/kafka/decorators/interceptors/kafka.response.interceptor'
import {
    KafkaResponseTimeoutInterceptor
} from '@src/infrastructure/kafka/decorators/interceptors/kafka.response.timeout.interceptor'
import { KafkaValidationPipe } from '@src/infrastructure/kafka/decorators/pipes/kafka.validation.pipe'
import {
    KafkaCommitOffsetFirstInterceptor
} from '@src/infrastructure/kafka/decorators/interceptors/kafka.commit-offset-first.interceptor'

export function MessageTopic(topic: string): any {
    return applyDecorators(
        MessagePattern(topic, Transport.KAFKA),
        UseInterceptors(
            KafkaResponseInterceptor,
            KafkaResponseTimeoutInterceptor
        ),
        // UseFilters(KafkaErrorFilter),
        UsePipes(KafkaValidationPipe)
    );
}

export const MessageValue = Payload;

export const MessageHeader = createParamDecorator<Record<string, any> | string>(
    (field: string, ctx: ExecutionContext): Record<string, any> => {
        const context: KafkaContext = ctx.switchToRpc().getContext();
        const headers: Record<string, any> = context.getMessage().headers;
        return field ? headers[field] : headers;
    }
);

export const MessageKey = createParamDecorator<string>(
    (field: string, ctx: ExecutionContext): string => {
        const context: KafkaContext = ctx.switchToRpc().getContext();
        const key: string = context.getMessage().key.toString();
        return key;
    }
);

export function MessageCommitOffsetInFirstRunning(): any {
    return applyDecorators(UseInterceptors(KafkaCommitOffsetFirstInterceptor));
}
