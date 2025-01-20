import { Module } from '@nestjs/common'
import { UserCreateService } from '@src/application/user/commands/user-create/user-create.service'
import { KafkaModule } from '@src/infrastructure/kafka/kafka.module'
import { RabbitMQModule } from '@src/infrastructure/rabbitmq/rabbitmq.module'
import { UserGetService } from '@src/application/user/commands/user-get/user-get.service'
import { UserCreateGateway } from '@src/application/user/commands/user-create/user-create.gateway'

@Module({
    imports: [
        RabbitMQModule,
    ],
    providers: [
        UserCreateGateway,
        UserGetService,
        UserCreateService,
    ],
    exports: [
        UserCreateService,
    ]
})
export class UserModule {
}
