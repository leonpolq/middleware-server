import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { AuthenticatedSocketIoAdapter } from '@src/infrastructure/socket/adapters/authenticated.socket-io.adapter'
import { JwtPureAuthService } from '@src/auth/services/jwt-pure-auth.service'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    // Access the ConfigService
    const configService = app.get(ConfigService)
    const jwtPureAuthService = app.get(JwtPureAuthService)

    // Retrieve the Kafka broker details from the configuration
    const clientId = configService.get<string>('kafka.clientId')
    const brokers = configService.get<string[]>('kafka.brokers')
    const groupId = configService.get<string>('kafka.consumer.groupId')
    const frontendUrl = configService.get<string>('frontend.url')

    app.enableCors({
        origin: frontendUrl, // Replace with your frontend port
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
        allowedHeaders: 'Content-Type, Authorization',
    });

    // app.connectMicroservice<MicroserviceOptions>({
    //     transport: Transport.KAFKA,
    //     options: {
    //         client: {
    //             clientId: clientId,
    //             brokers: brokers,
    //         },
    //         consumer: {
    //             groupId: groupId,
    //             sessionTimeout: 60000,           // 60s in ms
    //             rebalanceTimeout: 90000,         // 90s in ms
    //             heartbeatInterval: 3000,         // 3s in ms
    //
    //             maxBytesPerPartition: 1048576,   // 1MB in bytes
    //             maxBytes: 10485760,              // 10MB in bytes
    //             maxWaitTimeInMs: 5000,           // 5s in ms
    //
    //             maxInFlightRequests: null,       // Set this to ensure guaranteed sequential consumption
    //
    //             retry: {
    //                 maxRetryTime: 60000,         // 60s in ms
    //                 initialRetryTime: 300,       // 0.3s in ms
    //                 retries: 5,
    //             },
    //         },
    //         subscribe: {
    //             // topics: Object.values(KAFKA_TOPIC_ENUM),
    //             fromBeginning: true,
    //         }
    //     },
    // })

    app.useWebSocketAdapter(new AuthenticatedSocketIoAdapter(app, jwtPureAuthService));

    await app.startAllMicroservices()
    await app.listen(3000)
}

bootstrap()
