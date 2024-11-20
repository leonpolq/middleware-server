import { KAFKA_TOPIC_ALL_ENUM } from '@src/infrastructure/kafka/kafka.topic.enum'
import {
    KAFKA_SCHEMA_REGISTRY_NAMESPACE
} from '@src/infrastructure/kafka/schema-registry/kafka.schema-registry.constants'

export const getSchemaNameUtil = (topic: KAFKA_TOPIC_ALL_ENUM): string => {
    return `${topic}.schema.value`
}

export const getFullSchemaNameUtil = (topic: KAFKA_TOPIC_ALL_ENUM): string => {
    return `${KAFKA_SCHEMA_REGISTRY_NAMESPACE}.${getSchemaNameUtil(topic)}`
}
