import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider'
import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, } from 'amazon-cognito-identity-js'
import { AuthRegisterUserDto } from '@src/auth/dtos/auth-register-user.dto'
import { AuthLoginUserDto } from '@src/auth/dtos/auth-login-user.dto'

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)
    private readonly userPoolId: string
    private readonly clientId: string
    private readonly region: string

    private readonly userPool: CognitoUserPool

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.userPoolId = this.configService.get<string>('aws.cognito.userPoolId')
        this.clientId = this.configService.get<string>('aws.cognito.clientId')
        this.region = this.configService.get<string>('aws.cognito.region')

        this.userPool = new CognitoUserPool({
            UserPoolId: this.userPoolId,
            ClientId: this.clientId,
        })
    }

    async registerUser(authRegisterUserDto: AuthRegisterUserDto) {
        const { name, email, password } = authRegisterUserDto

        return new Promise((resolve, reject) => {
            this.userPool.signUp(
                name,
                password,
                [
                    new CognitoUserAttribute({
                        Name: 'email',
                        Value: email,
                    }),
                ],
                null,
                (err, result) => {
                    this.logger.log("Registering user", result)
                    this.logger.log("Registering user", err)

                    if (!result) {

                        reject(err)
                    } else {
                        resolve(result.user)
                    }
                },
            )
        })
    }

    async authenticateUser(authLoginUserDto: AuthLoginUserDto) {
        const { email, password } = authLoginUserDto
        const userData = {
            Username: email,
            Pool: this.userPool,
        }

        const authenticationDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
        })

        const userCognito = new CognitoUser(userData)

        return new Promise((resolve, reject) => {
            userCognito.authenticateUser(authenticationDetails, {
                onSuccess: (result) => {
                    resolve({
                        accessToken: result.getAccessToken().getJwtToken(),
                        refreshToken: result.getRefreshToken().getToken(),
                    })
                },
                onFailure: (err) => {
                    reject(err)
                },
            })
        })
    }
}
