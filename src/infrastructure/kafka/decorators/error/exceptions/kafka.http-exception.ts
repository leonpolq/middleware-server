import { HttpException, HttpStatus } from '@nestjs/common';
import { IKafkaErrorException } from '@src/infrastructure/kafka/kafka.interface'

export class KafkaHttpException extends HttpException {
    constructor(exception: IKafkaErrorException) {
        if (
            'message' in exception &&
            'statusCode' in exception &&
            'statusHttp' in exception
        ) {
            const { statusHttp, ...data } = exception;
            super(data, statusHttp);
        } else {
            super(
                {
                    statusCode: 400,
                    message: 'http.serverError.internalServerError',
                },
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
