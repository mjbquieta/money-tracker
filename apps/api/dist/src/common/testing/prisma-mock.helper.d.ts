import { PrismaService } from '../../prisma/prisma.service';
type MockPrismaModel = {
    findFirst: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
    create: jest.Mock;
    createMany: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    count: jest.Mock;
};
export type MockPrismaService = {
    [K in keyof PrismaService]: K extends '$transaction' ? jest.Mock : K extends '$connect' | '$disconnect' ? jest.Mock : MockPrismaModel;
};
export declare function createMockPrismaService(): MockPrismaService;
export {};
