import { LoginDto } from './auth.dto';
import { UserService } from 'src/user/user.service';
export declare class AuthService {
    private readonly userService;
    constructor(userService: UserService);
    login(payload: LoginDto): Promise<import("lodash").Omit<{
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
    }, "password">>;
}
