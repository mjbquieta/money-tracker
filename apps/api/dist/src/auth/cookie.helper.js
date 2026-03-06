"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setRefreshTokenCookie = setRefreshTokenCookie;
exports.clearRefreshTokenCookie = clearRefreshTokenCookie;
exports.getRefreshTokenFromCookie = getRefreshTokenFromCookie;
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
function setRefreshTokenCookie(res, token) {
    res.cookie(REFRESH_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/v1/auth',
        maxAge: COOKIE_MAX_AGE,
    });
}
function clearRefreshTokenCookie(res) {
    res.clearCookie(REFRESH_TOKEN_COOKIE, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/api/v1/auth',
    });
}
function getRefreshTokenFromCookie(cookies) {
    return cookies?.[REFRESH_TOKEN_COOKIE];
}
//# sourceMappingURL=cookie.helper.js.map