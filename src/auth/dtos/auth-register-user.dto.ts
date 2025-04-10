import { IsEmail, IsString, Matches } from 'class-validator'

export class AuthRegisterUserDto {
    @IsString()
    name: string

    @IsEmail()
    email: string

    /* Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character */

    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
        { message: 'invalid password' },
    )
    password: string

}

