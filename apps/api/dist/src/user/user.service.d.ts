import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserWithSettingsDto } from './user.dto';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from 'src/settings/settings.service';
import { UUID } from 'crypto';
import { IncomeSourceService } from 'src/income-source/income-source.service';
export declare class UserService {
    private readonly prisma;
    private readonly configService;
    private readonly settingsService;
    private readonly incomeService;
    private saltRounds;
    constructor(prisma: PrismaService, configService: ConfigService, settingsService: SettingsService, incomeService: IncomeSourceService);
    createUser(payload: CreateUserWithSettingsDto): Promise<({
        settings: {
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            currency: string;
            userId: string;
        } | null;
        incomeSources: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            userId: string;
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
        incomeSources: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            userId: string;
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
}
