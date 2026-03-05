import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDebtDto, UpdateDebtDto, CreateDebtPaymentDto } from './debt.dto';
export declare class DebtService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: UUID, payload: CreateDebtDto): Promise<{
        payments: {
            id: string;
            createdAt: Date;
            amount: number;
            note: string | null;
            debtId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.DebtStatus;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        amount: number;
        type: import("@prisma/client").$Enums.DebtType;
        counterparty: string;
        dueDate: Date | null;
        paidAmount: number;
    }>;
    findAll(userId: UUID): Promise<({
        _count: {
            payments: number;
        };
        payments: {
            id: string;
            createdAt: Date;
            amount: number;
            note: string | null;
            debtId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.DebtStatus;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        amount: number;
        type: import("@prisma/client").$Enums.DebtType;
        counterparty: string;
        dueDate: Date | null;
        paidAmount: number;
    })[]>;
    findOne(userId: UUID, debtId: UUID): Promise<{
        _count: {
            payments: number;
        };
        payments: {
            id: string;
            createdAt: Date;
            amount: number;
            note: string | null;
            debtId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.DebtStatus;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        amount: number;
        type: import("@prisma/client").$Enums.DebtType;
        counterparty: string;
        dueDate: Date | null;
        paidAmount: number;
    }>;
    update(userId: UUID, debtId: UUID, payload: UpdateDebtDto): Promise<{
        payments: {
            id: string;
            createdAt: Date;
            amount: number;
            note: string | null;
            debtId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.DebtStatus;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        amount: number;
        type: import("@prisma/client").$Enums.DebtType;
        counterparty: string;
        dueDate: Date | null;
        paidAmount: number;
    }>;
    delete(userId: UUID, debtId: UUID): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.DebtStatus;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        amount: number;
        type: import("@prisma/client").$Enums.DebtType;
        counterparty: string;
        dueDate: Date | null;
        paidAmount: number;
    }>;
    addPayment(userId: UUID, debtId: UUID, payload: CreateDebtPaymentDto): Promise<{
        _count: {
            payments: number;
        };
        payments: {
            id: string;
            createdAt: Date;
            amount: number;
            note: string | null;
            debtId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.DebtStatus;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        amount: number;
        type: import("@prisma/client").$Enums.DebtType;
        counterparty: string;
        dueDate: Date | null;
        paidAmount: number;
    }>;
    deletePayment(userId: UUID, debtId: UUID, paymentId: UUID): Promise<{
        _count: {
            payments: number;
        };
        payments: {
            id: string;
            createdAt: Date;
            amount: number;
            note: string | null;
            debtId: string;
        }[];
    } & {
        id: string;
        status: import("@prisma/client").$Enums.DebtStatus;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        amount: number;
        type: import("@prisma/client").$Enums.DebtType;
        counterparty: string;
        dueDate: Date | null;
        paidAmount: number;
    }>;
    getSummary(userId: UUID): Promise<{
        totalDebts: number;
        activeDebts: number;
        settledDebts: number;
        totalIOwe: number;
        totalOwedToMe: number;
        iOweCount: number;
        owedToMeCount: number;
    }>;
}
