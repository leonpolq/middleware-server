import { ArrayMinSize, IsArray, IsString, MaxLength, MinLength } from 'class-validator'

export class StartGameSocketRequestDto {
    @IsString()
    @MaxLength(320)
    @MinLength(5)
    readonly gameId: string

    @IsArray()
    @ArrayMinSize(1)
    @IsString({ each: true })
    @MaxLength(320, { each: true })
    @MinLength(5, { each: true })
    readonly entityIds: string[]

    @IsString()
    @MaxLength(320)
    @MinLength(5)
    readonly mapId: string
}
