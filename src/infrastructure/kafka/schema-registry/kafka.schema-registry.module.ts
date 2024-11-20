import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry'
import { KafkaSchemaRegistryService } from '@src/infrastructure/kafka/schema-registry/kafka.schema-registry.service'
import { SchemaRegistryInjection } from '@src/infrastructure/kafka/kafka.constant'

@Module({
    providers: [
        {
            provide: SchemaRegistryInjection,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const schemaRegistry = new SchemaRegistry({
                    host: configService.get('kafka.schemaRegistry.host'),
                })

                return schemaRegistry
            },
        },
        KafkaSchemaRegistryService,
    ],
    exports: [KafkaSchemaRegistryService],
    controllers: [],
    imports: [],
})
export class KafkaSchemaRegistryModule {
}
