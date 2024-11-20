import { Module } from '@nestjs/common'
import configuration from '@src/config/configuration'
import validationSchema from '@src/config/validation.schema'
import { ConfigModule } from '@nestjs/config'
import { KafkaModule } from '@src/infrastructure/kafka/kafka.module'
import { KafkaService } from '@src/infrastructure/kafka/kafka.service'
import { SocketModule } from '@src/infrastructure/socket/socket.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
            load: [configuration],  // Load custom configuration
            validationSchema: validationSchema,  // Validate the custom configuration
            isGlobal: true,         // Makes ConfigModule globally available
        }),
        KafkaModule,
        SocketModule,
    ],
    controllers: [],
    providers: [],
    exports: [KafkaModule]
})
export class CommonModule {
}
