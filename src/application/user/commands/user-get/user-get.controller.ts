import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser, CurrentUserInterface } from '@src/utils/current-user.decorator'
import { UserGetService } from '@src/application/user/commands/user-get/user-get.service'

export interface Response<T> {
    data: T;
}

@UseGuards(AuthGuard('jwt'))
@Controller('api/v1/user')
export class UserGetController {
    constructor(
        private readonly userGetService: UserGetService,
    ) {}

    @Get()
    list(@CurrentUser() user: CurrentUserInterface) {
        return this.userGetService.get(user)
    }
}