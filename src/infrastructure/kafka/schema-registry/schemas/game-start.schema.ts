import { SchemaType } from '@kafkajs/confluent-schema-registry/dist/@types'
import { SchemaKafkaType } from '@src/infrastructure/kafka/schema-registry/schemas/schema.kafka.type'
import { GAME_SEVICE_KAFKA_TOPIC_ENUM, KAFKA_TOPIC_ALL_ENUM } from '@src/infrastructure/kafka/kafka.topic.enum'
import { getSchemaNameUtil } from '@src/infrastructure/kafka/utils/get-schema-name.util'
import {
    KAFKA_SCHEMA_REGISTRY_NAMESPACE
} from '@src/infrastructure/kafka/schema-registry/kafka.schema-registry.constants'

export const GameStartSchema = {
    type: SchemaType.AVRO,
    schema: JSON.stringify({
        type: 'record',
        namespace: KAFKA_SCHEMA_REGISTRY_NAMESPACE,
        name: getSchemaNameUtil(KAFKA_TOPIC_ALL_ENUM.GAME_START),
        fields: [
            { name: 'correlationId', type: 'string' },

            { name: 'gameId', type: 'string', maxLength: 320, minLength: 5 },
            { name: 'entityIds', type: { type: 'array', items: 'string' } },
            { name: 'mapId', type: 'string' },
        ],
    })
} as SchemaKafkaType
