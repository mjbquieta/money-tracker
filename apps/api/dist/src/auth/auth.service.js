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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const lodash_1 = require("lodash");
const user_service_1 = require("../user/user.service");
const refresh_token_service_1 = require("./refresh-token.service");
let AuthService = class AuthService {
    userService;
    jwtService;
    refreshTokenService;
    constructor(userService, jwtService, refreshTokenService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }
    async login(payload, userAgent, ipAddress) {
        const isEmail = !(0, lodash_1.isEmpty)(payload.email);
        const val = (isEmail ? payload.email : payload.username) || '';
        const user = await this.userService.findByCredentials(val, payload.password, isEmail);
        if (user.isTwoFactorEnabled) {
            const partialToken = this.jwtService.sign({
                sub: user.id,
                email: user.email,
                username: user.username,
                tokenType: 'partial',
            }, { expiresIn: '5m' });
            return {
                requiresTwoFactor: true,
                accessToken: partialToken,
            };
        }
        const tokenPayload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            tokenType: 'full',
        };
        const refreshToken = await this.refreshTokenService.generateRefreshToken(user.id, userAgent, ipAddress);
        return {
            user,
            accessToken: this.jwtService.sign(tokenPayload),
            refreshToken,
        };
    }
    async refreshTokens(rawRefreshToken, userAgent, ipAddress) {
        const { newRawToken, userId } = await this.refreshTokenService.validateAndRotate(rawRefreshToken, userAgent, ipAddress);
        const user = await this.userService.findOne(userId);
        const tokenPayload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            tokenType: 'full',
        };
        return {
            accessToken: this.jwtService.sign(tokenPayload),
            refreshToken: newRawToken,
        };
    }
    async logout(rawRefreshToken) {
        await this.refreshTokenService.revokeByRawToken(rawRefreshToken);
    }
    async logoutAll(userId) {
        await this.refreshTokenService.revokeAllUserTokens(userId);
    }
    async completeTwoFactorLogin(userId, userAgent, ipAddress) {
        const user = await this.userService.findOne(userId);
        const tokenPayload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            tokenType: 'full',
        };
        const refreshToken = await this.refreshTokenService.generateRefreshToken(user.id, userAgent, ipAddress);
        return {
            user,
            accessToken: this.jwtService.sign(tokenPayload),
            refreshToken,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        refresh_token_service_1.RefreshTokenService])
], AuthService);
//# sourceMappingURL=auth.service.js.map