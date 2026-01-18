import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserWithSettingsDto, UpdateProfileDto, ChangePasswordDto } from './user.dto';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from 'src/settings/settings.service';
import { UUID } from 'crypto';
import { CategoryService } from 'src/category/category.service';
export declare class UserService {
    private readonly prisma;
    private readonly configService;
    private readonly settingsService;
    private readonly categoryService;
    private saltRounds;
    constructor(prisma: PrismaService, configService: ConfigService, settingsService: SettingsService, categoryService: CategoryService);
    createUser(payload: CreateUserWithSettingsDto): Promise<({
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
    findByCredentials(val: string, password: string, isEmail?: boolean): Promise<import("lodash").Omit<{
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
    findOne(userId: UUID): Promise<import("lodash").Omit<{
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
        password: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, "password">>;
    updateProfile(userId: UUID, payload: UpdateProfileDto): Promise<import("lodash").Omit<{
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
        password: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, "password">>;
    changePassword(userId: UUID, payload: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
