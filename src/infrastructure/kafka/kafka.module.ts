import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { Partitioners } from 'kafkajs'
import { KafkaService } from '@src/infrastructure/kafka/kafka.service'
import { KAFKA_SERVICE_PRODUCER } from '@src/infrastructure/kafka/kafka.constant'
import { KafkaSchemaRegistryModule } from '@src/infrastructure/kafka/schema-registry/kafka.schema-registry.module'

@Module({
    providers: [
        KafkaService,
    ],
    exports: [KafkaService],
    controllers: [],
    imports: [
        KafkaSchemaRegistryModule,
        ClientsModule.registerAsync([
            {
                name: KAFKA_SERVICE_PRODUCER,
                inject: [ConfigService],
                imports: [ConfigModule],
                useFactory: async (configService: ConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            clientId: configService.get('kafka.clientId'),
                            brokers: configService.get('kafka.brokers'),
                        },
                        consumer: {
                            groupId: 'game-logic-consumer' + Math.random(),
                        },
                        producer: {
                            createPartitioner: Partitioners.LegacyPartitioner,
                            transactionTimeout: 100000, // 30000 .. 60000
                            retry: {
                                maxRetryTime: 60000, // 30s
                                initialRetryTime: 300, // 3s
                                retries: 5,
                            },
                            allowAutoTopicCreation: true
                        },
                    },
                }),
            },
        ]),
    ],
})
export class KafkaModule {
}
