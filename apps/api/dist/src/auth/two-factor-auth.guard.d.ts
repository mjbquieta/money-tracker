import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
export declare class TwoFactorAuthGuard extends AuthGuard {
    canActivate(context: ExecutionContext): Promise<boolean>;
}
