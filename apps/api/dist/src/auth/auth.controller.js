"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_dto_1 = require("./auth.dto");
const auth_service_1 = require("./auth.service");
const auth_guard_1 = require("./auth.guard");
const two_factor_auth_guard_1 = require("./two-factor-auth.guard");
const current_user_decorator_1 = require("./current-user.decorator");
const refresh_token_service_1 = require("./refresh-token.service");
const two_factor_service_1 = require("./two-factor.service");
const cookie_helper_1 = require("./cookie.helper");
let AuthController = class AuthController {
    authService;
    refreshTokenService;
    twoFactorService;
    constructor(authService, refreshTokenService, twoFactorService) {
        this.authService = authService;
        this.refreshTokenService = refreshTokenService;
        this.twoFactorService = twoFactorService;
    }
    async login(body, req, res) {
        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;
        const result = await this.authService.login(body, userAgent, ipAddress);
        if ('refreshToken' in result && result.refreshToken) {
            (0, cookie_helper_1.setRefreshTokenCookie)(res, result.refreshToken);
            const { refreshToken, ...rest } = result;
            return rest;
        }
        return result;
    }
    async refresh(req, res) {
        const rawToken = (0, cookie_helper_1.getRefreshTokenFromCookie)(req.cookies);
        if (!rawToken) {
            throw new common_1.UnauthorizedException('No refresh token provided');
        }
        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;
        const result = await this.authService.refreshTokens(rawToken, userAgent, ipAddress);
        (0, cookie_helper_1.setRefreshTokenCookie)(res, result.refreshToken);
        return { accessToken: result.accessToken };
    }
    async logout(req, res) {
        const rawToken = (0, cookie_helper_1.getRefreshTokenFromCookie)(req.cookies);
        if (rawToken) {
            await this.authService.logout(rawToken);
        }
        (0, cookie_helper_1.clearRefreshTokenCookie)(res);
        return { message: 'Logged out successfully' };
    }
    async logoutAll(userId, res) {
        await this.authService.logoutAll(userId);
        (0, cookie_helper_1.clearRefreshTokenCookie)(res);
        return { message: 'All sessions revoked' };
    }
    async getSessions(userId, req) {
        const rawToken = (0, cookie_helper_1.getRefreshTokenFromCookie)(req.cookies);
        const currentTokenHash = rawToken
            ? this.refreshTokenService.hashToken(rawToken)
            : undefined;
        return this.refreshTokenService.getActiveSessions(userId, currentTokenHash);
    }
    async revokeSession(userId, sessionId) {
        await this.refreshTokenService.revokeSession(userId, sessionId);
        return { message: 'Session revoked' };
    }
    async setupTwoFactor(userId) {
        return this.twoFactorService.generateSecret(userId);
    }
    async verifyTwoFactor(userId, body) {
        return this.twoFactorService.verifyAndEnable(userId, body.code);
    }
    async disableTwoFactor(userId, body) {
        return this.twoFactorService.disable(userId, body.password, body.code);
    }
    async getBackupCodes(userId) {
        const codes = await this.twoFactorService.generateBackupCodes(userId);
        return { backupCodes: codes };
    }
    async authenticateTwoFactor(userId, body, req, res) {
        await this.twoFactorService.authenticate(userId, body.code, body.isBackupCode);
        const userAgent = req.headers['user-agent'];
        const ipAddress = req.ip;
        const result = await this.authService.completeTwoFactorLogin(userId, userAgent, ipAddress);
        (0, cookie_helper_1.setRefreshTokenCookie)(res, result.refreshToken);
        return {
            user: result.user,
            accessToken: result.accessToken,
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('logout-all'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutAll", null);
__decorate([
    (0, common_1.Get)('sessions'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Delete)('sessions/:id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "revokeSession", null);
__decorate([
    (0, common_1.Post)('2fa/setup'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "setupTwoFactor", null);
__decorate([
    (0, common_1.Post)('2fa/verify'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, auth_dto_1.VerifyTwoFactorDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyTwoFactor", null);
__decorate([
    (0, common_1.Post)('2fa/disable'),
    (0, common_1.UseGuards)(two_factor_auth_guard_1.TwoFactorAuthGuard),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, auth_dto_1.DisableTwoFactorDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "disableTwoFactor", null);
__decorate([
    (0, common_1.Get)('2fa/backup-codes'),
    (0, common_1.UseGuards)(two_factor_auth_guard_1.TwoFactorAuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getBackupCodes", null);
__decorate([
    (0, common_1.Post)('2fa/authenticate'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)(new common_1.ValidationPipe({ transform: true, whitelist: true }))),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, auth_dto_1.TwoFactorAuthenticateDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "authenticateTwoFactor", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('api/v1/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        refresh_token_service_1.RefreshTokenService,
        two_factor_service_1.TwoFactorService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map