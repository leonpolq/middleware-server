import { Inject, Injectable, Logger, OnModuleInit, } from '@nestjs/common'
import { ClientKafka, KafkaContext } from '@nestjs/microservices'
import { firstValueFrom, Observable, of, timeout } from 'rxjs'
import { IKafkaService } from '@src/infrastructure/kafka/kafka.service.interface'
import { KAFKA_SERVICE_PRODUCER } from '@src/infrastructure/kafka/kafka.constant'
import { KAFKA_TOPIC_ALL_ENUM, KAFKA_TOPIC_ENUM } from '@src/infrastructure/kafka/kafka.topic.enum'
import {
    IKafkaMessage,
    IKafkaProducerMessageOptions,
    IKafkaProducerSendMessageOptions
} from '@src/infrastructure/kafka/kafka.interface'
import { KafkaSchemaRegistryService } from '@src/infrastructure/kafka/schema-registry/kafka.schema-registry.service'
import { SchemaKafkaType } from '@src/infrastructure/kafka/schema-registry/schemas/schema.kafka.type'
import { catchError } from 'rxjs/operators'

@Injectable()
export class KafkaService implements IKafkaService,
    OnModuleInit
    // OnApplicationBootstrap,
{
    private readonly timeout: number
    protected logger = new Logger(KafkaService.name)

    constructor(
        @Inject(KAFKA_SERVICE_PRODUCER)
        private readonly clientKafka: ClientKafka,
        private readonly kafkaSchemaRegistryService: KafkaSchemaRegistryService,
    ) {
        this.timeout = 1000
    }

    async onModuleInit() {
        Object.values(KAFKA_TOPIC_ENUM)
            .map(topic => this.clientKafka.subscribeToResponseOf(topic))

        await this.clientKafka.connect()
        console.log('Kafka Client Connected')
        this.logger.log('Kafka Client Connected')
    }

    // async onApplicationBootstrap(): Promise<void> {
    //     await this.clientKafka.subscribeToResponseOf(KAFKA_TOPIC_ENUM.ACK_SUCCESS)
    //     await this.clientKafka.subscribeToResponseOf(KAFKA_TOPIC_ENUM.ACK_ERROR)
    //
    //     await this.clientKafka.connect()
    //     console.log('Kafka Client Connected')
    //     this.logger.log('Kafka Client Connected')
    // }

    async produceSend<T, N>(
        topic: KAFKA_TOPIC_ALL_ENUM,
        data: T,
    ) {
        console.log('produceSend')

        // const message: IKafkaMessage<T> = {
        //     key: this.createId(),
        //     value: data,
        // }

        if (!(await this.kafkaSchemaRegistryService.validateDataForTopic(topic, data as SchemaKafkaType))) {
            console.log('Data is not valid')

            throw new Error('Data is not valid')
        }

        const message = await this.kafkaSchemaRegistryService.encodeMessage(topic, data)
        const send: any = await new Promise((resolve) => {
            this.clientKafka
                .send<any, any>(topic, message)
                .pipe(
                    // handle error
                    catchError((error) => {
                        console.log('>>>>>>>>>ERROR>>>>>>>>>>>>>>>', error)
                        resolve({ error })

                        // return throwError(error)
                        return of({ error })
                    })
                )
                .subscribe((result: number) => {
                    console.log('>>>>>>>>>RESULT>>>>>>>>>>>>>>>', result)
                    resolve(result)
                })
        })

        if (send.error) {
            // throw send.error
            return send.error
        }

        return undefined
    }

    produceEmit<T, N>(
        topic: string,
        data: T,
        options?: IKafkaProducerMessageOptions
    ): Observable<N> {
        const message: IKafkaMessage<T> = {
            key: this.createId(),
            value: data,
            headers: options && options.headers ? options.headers : undefined,
        }

        return this.clientKafka
            .emit<any, string>(topic, JSON.stringify(message))
            .pipe(timeout(this.timeout))
    }

    async produceSendSequential<T, N = any>(
        topic: string,
        data: T,
        options?: IKafkaProducerSendMessageOptions
    ): Promise<N> {
        const message: IKafkaMessage<T> = {
            key: `${topic}-sequential-key`,
            value: data,
            headers: options && options.headers ? options.headers : undefined,
        }

        const send = await firstValueFrom(
            this.clientKafka
                .send<any, string>(topic, JSON.stringify(message))
                .pipe(timeout(this.timeout))
        )

        if (send.error) {
            throw send.error
        }

        return options && options.raw ? send : send.value
    }

    produceEmitSequential<T, N = any>(
        topic: string,
        data: T,
        options?: IKafkaProducerMessageOptions
    ): Observable<N> {
        const message: IKafkaMessage<T> = {
            key: `${topic}-sequential-key`,
            value: data,
            headers: options && options.headers ? options.headers : undefined,
        }

        return this.clientKafka
            .emit<any, string>(topic, JSON.stringify(message))
            .pipe(timeout(this.timeout))
    }

    createId(): string {
        const rand: string = Math.random().toString()
        const timestamp = `${Date.now()}`
        return `${timestamp}-${rand}`
    }

    async commitOffsets(context: KafkaContext): Promise<void> {
        const originalMessage = context.getMessage()
        const kafkaTopic = context.getTopic()
        const kafkaPartition = context.getPartition()
        const { offset } = originalMessage

        return this.clientKafka.commitOffsets([
            { topic: kafkaTopic, partition: kafkaPartition, offset },
        ])
    }
}
