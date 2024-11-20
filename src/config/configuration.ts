import * as process from 'process'

export default () => ({
    kafka: {
        clientId: process.env.KAFKA_CLIENT_URL || 'KAFKA_ACK',
        brokers: process.env.KAFKA_BROKERS || ['localhost:9092'],

        schemaRegistry: {
            host: process.env.SCHEMA_REGISTRY_HOST || 'http://localhost:8081',
        },
        consumer:{
            groupId: process.env.KAFKA_CONSUMER_GROUP_ID || 'middleware-consumer-group'
        }
    },
    aws:{
        cognito: {
            userPoolId: process.env.AWS_COGNITO_POOL_ID || 'us-east-1_XXXXXXXXX',
            clientId: process.env.AWS_COGNITO_CLIENT_ID || 'xxxxxxxxxxxxxxxxxxxx',
            region: process.env.AWS_COGNITO_REGION || 'eu-west-3'
        }
    },
    frontend: {
        url: process.env.FRONTEND_URL || 'http://localhost:3001'
    }
});
