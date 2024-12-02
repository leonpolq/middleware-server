import { INestApplicationContext } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { ServerOptions } from 'socket.io'
import { JwtPureAuthService } from '@src/auth/services/jwt-pure-auth.service'

export class AuthenticatedSocketIoAdapter extends IoAdapter {
    constructor(
        private readonly app: INestApplicationContext,
        private readonly jwtPureAuthService: JwtPureAuthService,
    ) {
        super(app)
    }

    createIOServer(port: number, options?: ServerOptions): any {
        options.allowRequest = async (request, allowFunction) => {
            try {
                const verified = await this.jwtPureAuthService.authenticate(request)

                if (verified) {
                    return allowFunction(null, true)
                }

                return allowFunction('Unauthorized', false)
            } catch (error) {
                console.error(error)
                return allowFunction('Unauthorized', false)
            }

        }

        return super.createIOServer(port, options)
    }
}