import { applyDecorators, createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GmailBasedValidationPipe, LeStartValidationPipe } from '@src/utils/gmail-based.validation.pipe'

export interface CurrentUserInterface {
    id: string;
    email: string;
}

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()

        return request.user // Access user from the request
    },
)

// export const CurrentTestUser = createParamDecorator(
//     (...params) => {
//         return CurrentUser(
//             new GmailBasedValidationPipe(),
//             new LeStartValidationPipe()
//         )(...params)
//     },
// )

