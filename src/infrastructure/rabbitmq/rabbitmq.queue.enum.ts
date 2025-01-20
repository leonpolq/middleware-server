export enum RABBITMQ_EXCHANGE_ENUM {
    GAME = 'game',
    MAP = 'map',
    USER = 'user',
}

export enum RABBITMQ_EXCHANGE_DLQ_ENUM {
    GAME_LOGIC_DLQ = 'game.start.dlq',
}

export const RABBITMQ_EXCHANGE_ALL_ENUM = {
    ...RABBITMQ_EXCHANGE_ENUM,
    ...RABBITMQ_EXCHANGE_DLQ_ENUM,
} as const;

export enum RABBITMQ_QUEUE_ENUM {
    GAME_START = 'game.start.queue',
    GAME_PAUSE = 'game.pause.queue',
    GAME_CREATE = 'game.create.queue',
    GAME_GET = 'game.get.queue',
    MAP_GET = 'map.get.queue',
    USER_CREATE = 'user.create.queue',
    USER_GET = 'user.get.queue',
}

export enum RABBITMQ_ROUTING_KEY_ENUM {
    GAME_CREATE = 'game.create.key.rpc',
    GAME_PAUSE = 'game.pause.key.rpc',
    GAME_START = 'game.start.key.rpc',
    GAME_GET = 'game.get.key.rpc',
    MAP_GET = 'map.get.key.rpc',
    USER_CREATE = 'user.create.key.rpc',
    USER_GET = 'user.get.key.rpc',
}

export type RABBITMQ_EXCHANGE_ALL_ENUM = typeof RABBITMQ_EXCHANGE_ALL_ENUM[keyof typeof RABBITMQ_EXCHANGE_ALL_ENUM];
