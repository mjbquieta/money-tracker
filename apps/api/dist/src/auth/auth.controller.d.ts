import { LoginDto } from './auth.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
        user: import("lodash").Omit<{
            settings: {
                id: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                currency: string;
                userId: string;
            } | null;
        } & {
            id: string;
            email: string;
            username: string;
            name: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            password: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        }, "password">;
        accessToken: string;
    }>;
}
