import { Module } from '@nestjs/common'
import { GameModule } from '@src/application/game/game.module'
import { CommonModule } from '@src/common.module'
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [GameModule, CommonModule, AuthModule, UserModule],
    controllers: [],
    providers: [],
})
export class AppModule {
}
