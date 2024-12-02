export enum RABBITMQ_EXCHANGE_ENUM {
    GAME_START = 'game.start',
    TEST_RUN = 'test.run',
}

export enum RABBITMQ_EXCHANGE_DLQ_ENUM {
    GAME_LOGIC_DLQ = 'game.start.dlq',
}

export const RABBITMQ_EXCHANGE_ALL_ENUM = {
    ...RABBITMQ_EXCHANGE_ENUM,
    ...RABBITMQ_EXCHANGE_DLQ_ENUM,
} as const;

export enum RABBITMQ_QUEUE_ENUM {
    GAME_START = 'game.start',
}

export enum RABBITMQ_ROUTING_KEY_ENUM {
    GAME_START = 'game.start.key.rpc',
    GAME_PAUSE = 'game.pause.key.rpc',
}

export type RABBITMQ_EXCHANGE_ALL_ENUM = typeof RABBITMQ_EXCHANGE_ALL_ENUM[keyof typeof RABBITMQ_EXCHANGE_ALL_ENUM];
