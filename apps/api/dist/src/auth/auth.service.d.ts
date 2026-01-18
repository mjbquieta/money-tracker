import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './auth.dto';
import { UserService } from '../user/user.service';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UserService, jwtService: JwtService);
    login(payload: LoginDto): Promise<{
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
