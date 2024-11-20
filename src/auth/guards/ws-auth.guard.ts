import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'

@Injectable()
export class WsAuthGuard extends AuthGuard('ws-jwt') {
    // canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    //     const client = context.switchToWs().getClient();
    //     const req = client.handshake; // Pass the handshake to Passport
    //
    //     return super.canActivate(new ExecutionContextHost([req]));
    // }
}
