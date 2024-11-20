import { HttpStatus, Injectable, ValidationError, ValidationPipe, } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

@Injectable()
export class KafkaValidationPipe extends ValidationPipe {
    constructor() {
        super({
            transform: true,
            skipNullProperties: false,
            skipUndefinedProperties: false,
            skipMissingProperties: false,
            exceptionFactory: (errors: ValidationError[]) => {
                console.log(JSON.stringify(errors), errors.map(e => e))
                return new RpcException({
                    statusCode: 400,
                    message: 'http.clientError.unprocessableEntity',
                    errors,
                    statusHttp: HttpStatus.UNPROCESSABLE_ENTITY,
                })
            }

        })
    }
}
