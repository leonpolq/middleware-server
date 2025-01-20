import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator'

export class UserCreateSocketRequestDto {
    @IsString()
    @MaxLength(320)
    @MinLength(5)
    readonly id: string

    @IsEmail()
    @MaxLength(320)
    @MinLength(5)
    readonly email: string

    @IsString()
    @MaxLength(320)
    @MinLength(5)
    readonly firstName: string

    @IsString()
    @MaxLength(320)
    @MinLength(5)
    readonly lastName: string

    @IsString()
    @MaxLength(320)
    @MinLength(4)
    readonly role: string
}

export class UserCreateLightSocketRequestDto {
    @IsString()
    @MaxLength(320)
    @MinLength(5)
    readonly id: string
}
