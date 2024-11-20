import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-jwt'
import { passportJwtSecret } from 'jwks-rsa'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class WsJwtStrategy extends PassportStrategy(Strategy, 'ws-jwt') {
    constructor(private readonly configService: ConfigService) {
        const userPoolId = configService.get<string>('aws.cognito.userPoolId')
        const clientId = configService.get<string>('aws.cognito.clientId')
        const region = configService.get<string>('aws.cognito.region')
        const authority = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`

        super({
            jwtFromRequest: (req: any) => {
                console.log('req.handshake', req.handshake)
                // Extract token from WebSocket headers (e.g., Authorization)
                if (req && req.handshake && req.handshake.headers.authorization) {
                    const authHeader = req.handshake.headers.authorization // Get the Authorization header
                    if (authHeader.startsWith('Bearer ')) {
                        return authHeader.split(' ')[1] // Return the token part
                    }
                }
                return null // Return null if no token is found
            },
            ignoreExpiration: false,
            audience: clientId,
            issuer: authority,
            algorithms: ['RS256'],
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: `${authority}/.well-known/jwks.json`,
            }),
        })
    }

    async validate(payload: any) {
        // Validate payload and attach user details to the request
        return { idUser: payload.sub, email: payload.email }
    }
}
