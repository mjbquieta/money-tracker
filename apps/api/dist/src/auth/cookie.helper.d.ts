import { Response } from 'express';
export declare function setRefreshTokenCookie(res: Response, token: string): void;
export declare function clearRefreshTokenCookie(res: Response): void;
export declare function getRefreshTokenFromCookie(cookies: Record<string, string>): string | undefined;
