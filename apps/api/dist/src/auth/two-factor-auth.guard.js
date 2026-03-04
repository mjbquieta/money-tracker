"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("./auth.guard");
let TwoFactorAuthGuard = class TwoFactorAuthGuard extends auth_guard_1.AuthGuard {
    async canActivate(context) {
        const isAuthed = await super.canActivate(context);
        if (!isAuthed)
            return false;
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (user?.tokenType === 'partial') {
            throw new common_1.ForbiddenException('Two-factor authentication required. Please complete 2FA verification.');
        }
        return true;
    }
};
exports.TwoFactorAuthGuard = TwoFactorAuthGuard;
exports.TwoFactorAuthGuard = TwoFactorAuthGuard = __decorate([
    (0, common_1.Injectable)()
], TwoFactorAuthGuard);
//# sourceMappingURL=two-factor-auth.guard.js.map