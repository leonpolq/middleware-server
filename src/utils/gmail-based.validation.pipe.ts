import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { CurrentUserInterface } from '@src/utils/current-user.decorator'

@Injectable()
export class GmailBasedValidationPipe implements PipeTransform {
    transform(value: CurrentUserInterface, metadata: ArgumentMetadata) {
        console.log('GmailBasedValidationPipe -> value', value)
        if (value.email.includes('gmail')) {
            return value;
        }

        throw new Error('Value must be a gmail address');
    }
}


@Injectable()
export class LeStartValidationPipe implements PipeTransform {
    transform(value: CurrentUserInterface, metadata: ArgumentMetadata) {
        console.log('LeStartValidationPipe -> value', value)

        if (value.email.slice(0, 2) === 'le') {
            return value;
        }

        throw new Error('Value must start with "le"');
    }
}

