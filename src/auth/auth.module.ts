import { Global, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from '@src/auth/services/jwt-strategy.service'
import { WsJwtStrategy } from '@src/auth/services/ws-jwt-strategy.service'
import { WsAuthGuard } from '@src/auth/guards/ws-auth.guard'
import { JwtPureAuthService } from '@src/auth/services/jwt-pure-auth.service'

@Global()
@Module({
    imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
    providers: [AuthService, JwtStrategy, WsJwtStrategy, WsAuthGuard, JwtPureAuthService],
    controllers: [AuthController],
    exports: [JwtPureAuthService]
})
export class AuthModule {
}
