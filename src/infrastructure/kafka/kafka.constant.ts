import { KAFKA_TOPIC_DQL_ENUM, KAFKA_TOPIC_ENUM } from '@src/infrastructure/kafka/kafka.topic.enum'
import { IKafkaCreateTopic } from '@src/infrastructure/kafka/kafka.interface'

export const KAFKA_SERVICE_PRODUCER = 'KAFKA_SERVICE_PRODUCER'

export const KafkaCreateTopics: IKafkaCreateTopic[] = [
    ...Object.values(
        KAFKA_TOPIC_ENUM
    ).map((val) => ({
        topic: val,
        topicReply: `${val}.reply`,
        // partition?: number;
        // replicationFactor?: number;
    })),
    ...Object.values(KAFKA_TOPIC_DQL_ENUM).map(val => ({ topic: val })),
]
export const SchemaRegistryInjection = 'SchemaRegistryInjection'