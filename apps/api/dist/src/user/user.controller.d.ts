import { UserService } from './user.service';
import { CreateUserWithSettingsDto } from './user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(body: CreateUserWithSettingsDto): Promise<({
        settings: {
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            currency: string;
            userId: string;
        } | null;
        categories: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            userId: string;
            description: string | null;
            isDefault: boolean;
            defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
        }[];
    } & {
        id: string;
        email: string;
        username: string;
        name: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }) | null>;
}
