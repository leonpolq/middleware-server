import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
    ) {
        const userPoolId = configService.get<string>('aws.cognito.userPoolId')
        const clientId = configService.get<string>('aws.cognito.clientId')
        const region = configService.get<string>('aws.cognito.region')
        const authority = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            audience: clientId,
            issuer: authority,
            algorithms: ['RS256'],
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 5,
                jwksUri: authority + '/.well-known/jwks.json',
            }),
        });
    }

    async validate(payload: any) {
        console.log("payload", payload)
        return { idUser: payload.sub, email: payload.email };
    }
}