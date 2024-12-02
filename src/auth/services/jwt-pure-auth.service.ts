import { Injectable } from '@nestjs/common'
import * as passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { passportJwtSecret } from 'jwks-rsa'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtPureAuthService {
    constructor(private readonly configService: ConfigService) {
        this.initializePassportStrategy()
    }

    private initializePassportStrategy() {
        const userPoolId = this.configService.get<string>('aws.cognito.userPoolId')
        const clientId = this.configService.get<string>('aws.cognito.clientId')
        const region = this.configService.get<string>('aws.cognito.region')
        const authority = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`

        // Create and register the Passport JWT strategy
        const jwtStrategy = this.getJWTStrategy(clientId, authority, (req) => req?.headers?.authorization)
        const jwtWSStrategy = this.getJWTStrategy(clientId, authority, (req) => req?.handshake?.headers?.authorization)

        passport.use('custom-jwt', jwtStrategy)
        passport.use('custom-ws-jwt', jwtWSStrategy)
    }

    private getJWTStrategy(clientId: string, authority: string, getAuthorization: (req: any) => string) {
        const jwtStrategy = new JwtStrategy(
            {
                jwtFromRequest: (req: any) => {
                    // Extract token from WebSocket headers (or elsewhere)
                    const authorization = getAuthorization(req)

                    if (authorization) {
                        if (authorization.startsWith('Bearer ')) {
                            return authorization.split(' ')[1]
                        }
                    }

                    return null
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
            },
            async (payload, done) => {
                try {
                    // Validate the payload
                    const user = { id: payload.sub, email: payload.email }
                    done(null, user)
                } catch (error) {
                    done(error, false)
                }
            },
        )
        return jwtStrategy
    }

    authenticate(req: any, strategy: string = 'custom-jwt'): Promise<any> {
        return new Promise((resolve, reject) => {
            passport.authenticate(strategy, { session: false }, (err, user, info) => {
                if (err || !user) {
                    reject(err || new Error('Unauthorized'))
                } else {
                    resolve(user)
                }
            })(req)
        })
    }
}
