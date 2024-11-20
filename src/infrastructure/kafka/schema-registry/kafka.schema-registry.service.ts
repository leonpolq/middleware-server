import { Inject, Injectable, Logger, OnModuleInit, } from '@nestjs/common'
import { SchemaRegistryInjection } from '@src/infrastructure/kafka/kafka.constant'
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry'
import { GameStartSchema } from '@src/infrastructure/kafka/schema-registry/schemas/game-start.schema'
import { KAFKA_TOPIC_ALL_ENUM } from '@src/infrastructure/kafka/kafka.topic.enum'
import { SchemaKafkaType } from '@src/infrastructure/kafka/schema-registry/schemas/schema.kafka.type'
import { getFullSchemaNameUtil } from '@src/infrastructure/kafka/utils/get-schema-name.util'

@Injectable()
export class KafkaSchemaRegistryService implements OnModuleInit {
    protected logger = new Logger(KafkaSchemaRegistryService.name)

    constructor(
        @Inject(SchemaRegistryInjection)
        private readonly schemaRegistry: SchemaRegistry
    ) {}

    async onModuleInit() {
        const schemas = [
            GameStartSchema
        ]

        await Promise.all(schemas.map(schema => {
            this.logger.log('Schema', schema)

            return this.schemaRegistry.register(schema)
        }))
        this.logger.log('AVRO schemas are registered')
    }

    async encodeMessage(topic: KAFKA_TOPIC_ALL_ENUM, message: any) {
        const subject = getFullSchemaNameUtil(topic)
        const schemaId = await this.schemaRegistry.getLatestSchemaId(subject)
        const avroMessage = await this.schemaRegistry.encode(schemaId, message)
// Buffer to string

        console.log('Resulted message', avroMessage.toString('utf-8'))

        return avroMessage
    }

    async decodeMessage(topic: KAFKA_TOPIC_ALL_ENUM, message: Buffer) {
        const subject = getFullSchemaNameUtil(topic)
        const schemaId = await this.schemaRegistry.getLatestSchemaId(subject)
        const schema = await this.schemaRegistry.getSchema(schemaId)
        const avroMessage = await this.schemaRegistry.decode(message)

        return avroMessage
    }

    async validateDataForTopic(topic: KAFKA_TOPIC_ALL_ENUM, data: SchemaKafkaType): Promise<boolean> {
        const subject = getFullSchemaNameUtil(topic)
        const schemaId = await this.schemaRegistry.getLatestSchemaId(subject)
        const schema = await this.schemaRegistry.getSchema(schemaId)

        return schema.isValid(data, {
            errorHook: (path: Array<string>, value: any, type?: any) => {
                this.logger.error(`Invalid data for topic ${topic}: ${path.join('.')}: ${value} (${type})`)
            }
        })
    }
}
