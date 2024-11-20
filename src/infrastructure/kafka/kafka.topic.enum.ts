export enum GAME_SEVICE_KAFKA_TOPIC_ENUM {
    GAME_START = 'nestjs.game.start'
}

export enum GAME_SERVICE_KAFKA_TOPIC_DQL_ENUM {
    GAME_START_DLQ = 'nestjs.game.start.dlq'
}

export enum USER_SERVICE_KAFKA_TOPIC_ENUM {
}

export enum USER_SERVICE_KAFKA_TOPIC_DQL_ENUM {
}

export enum KAFKA_TOPIC_ENUM {
    GAME_START = 'nestjs.game.start'
}

export enum KAFKA_TOPIC_DQL_ENUM {
    GAME_START_DLQ = 'nestjs.game.start.dlq'
}

export const KAFKA_TOPIC_ALL_ENUM = {
    ...KAFKA_TOPIC_ENUM,
    ...KAFKA_TOPIC_DQL_ENUM,
} as const;

export type KAFKA_TOPIC_ALL_ENUM = typeof KAFKA_TOPIC_ALL_ENUM[keyof typeof KAFKA_TOPIC_ALL_ENUM];
