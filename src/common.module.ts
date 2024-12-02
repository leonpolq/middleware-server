import { Module } from '@nestjs/common'
import configuration from '@src/config/configuration'
import validationSchema from '@src/config/validation.schema'
import { ConfigModule } from '@nestjs/config'
import { KafkaModule } from '@src/infrastructure/kafka/kafka.module'
import { SocketModule } from '@src/infrastructure/socket/socket.module'
import { RabbitMQModule } from '@src/infrastructure/rabbitmq/rabbitmq.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
            load: [configuration],  // Load custom configuration
            validationSchema: validationSchema,  // Validate the custom configuration
            isGlobal: true,         // Makes ConfigModule globally available
        }),
        KafkaModule,
        RabbitMQModule,
        SocketModule,
    ],
    controllers: [],
    providers: [],
    exports: [KafkaModule, RabbitMQModule]
})
export class CommonModule {
}
