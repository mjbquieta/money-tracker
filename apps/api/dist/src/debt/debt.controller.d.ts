import { UUID } from 'crypto';
import { DebtService } from './debt.service';
import { CreateDebtDto, UpdateDebtDto, CreateDebtPaymentDto } from './debt.dto';
export declare class DebtController {
    private readonly debtService;
    constructor(debtService: DebtService);
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
    getSummary(userId: UUID): Promise<{
        totalDebts: number;
        activeDebts: number;
        settledDebts: number;
        totalIOwe: number;
        totalOwedToMe: number;
        iOweCount: number;
        owedToMeCount: number;
    }>;
    findOne(userId: UUID, id: UUID): Promise<{
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
    update(userId: UUID, id: UUID, payload: UpdateDebtDto): Promise<{
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
    delete(userId: UUID, id: UUID): Promise<{
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
    addPayment(userId: UUID, id: UUID, payload: CreateDebtPaymentDto): Promise<{
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
    deletePayment(userId: UUID, id: UUID, paymentId: UUID): Promise<{
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
}
