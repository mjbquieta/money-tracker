import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Injectable()
export class TwoFactorAuthGuard extends AuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First, run the standard JWT auth
    const isAuthed = await super.canActivate(context);
    if (!isAuthed) return false;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Reject partial tokens (2FA pending)
    if (user?.tokenType === 'partial') {
      throw new ForbiddenException(
        'Two-factor authentication required. Please complete 2FA verification.',
      );
    }

    return true;
  }
}
