import { Response } from 'express';

const REFRESH_TOKEN_COOKIE = 'refresh_token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const isSecure = process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true';

export function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/api/v1/auth',
    maxAge: COOKIE_MAX_AGE,
  });
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/api/v1/auth',
  });
}

export function getRefreshTokenFromCookie(cookies: Record<string, string>): string | undefined {
  return cookies?.[REFRESH_TOKEN_COOKIE];
}
