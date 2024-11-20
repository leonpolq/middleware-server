import {
    Body,
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import { AuthRegisterUserDto } from './dtos/auth-register-user.dto';
import { AuthService } from '@src/auth/auth.service'

@Controller('api/v1/auth')
export class AuthController {
    constructor(private awsCognitoService: AuthService) {}

    @Post('/register')
    async register(@Body() authRegisterUserDto: AuthRegisterUserDto) {
        return this.awsCognitoService.registerUser(authRegisterUserDto);
    }

    @Post('/login')
    @UsePipes(ValidationPipe)
    async login(@Body() authLoginUserDto: AuthLoginUserDto) {
        return this.awsCognitoService.authenticateUser(authLoginUserDto);
    }
}
