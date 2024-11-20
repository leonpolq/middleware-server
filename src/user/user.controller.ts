import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CurrentUser } from '@src/utils/current-user.decorator'

@Controller('api/v1/user')
export class UserController {
    @UseGuards(AuthGuard('jwt'))
    @Get()
    list(@CurrentUser() user: any) {
        console.log("user",user)
        return user
    }
}