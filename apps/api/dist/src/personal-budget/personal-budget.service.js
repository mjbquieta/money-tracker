"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonalBudgetService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_helper_1 = require("../common/helpers/pagination.helper");
let PersonalBudgetService = class PersonalBudgetService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, payload) {
        return this.prisma.$transaction(async (tx) => {
            const personalBudget = await tx.personalBudget.create({
                data: {
                    userId,
                    name: payload.name,
                    description: payload.description,
                },
            });
            if (payload.items && payload.items.length > 0) {
                await tx.personalBudgetItem.createMany({
                    data: payload.items.map((item) => ({
                        name: item.name,
                        description: item.description,
                        amount: item.amount,
                        personalBudgetId: personalBudget.id,
                    })),
                });
            }
            return tx.personalBudget.findUnique({
                where: { id: personalBudget.id },
                include: {
                    items: {
                        where: { deletedAt: null },
                        orderBy: { createdAt: 'desc' },
                    },
                },
            });
        });
    }
    async findAll(userId, pagination) {
        const where = {
            userId,
            deletedAt: null,
        };
        const prismaArgs = (0, pagination_helper_1.buildPrismaArgs)(pagination);
        const [items, totalCount] = await Promise.all([
            this.prisma.personalBudget.findMany({
                where,
                include: {
                    items: {
                        where: { deletedAt: null },
                        orderBy: { createdAt: 'desc' },
                    },
                },
                ...prismaArgs,
            }),
            this.prisma.personalBudget.count({ where }),
        ]);
        return (0, pagination_helper_1.buildPaginatedResponse)(items, pagination, totalCount);
    }
    async findOne(userId, personalBudgetId) {
        const personalBudget = await this.prisma.personalBudget.findFirst({
            where: {
                id: personalBudgetId,
                userId,
                deletedAt: null,
            },
            include: {
                items: {
                    where: { deletedAt: null },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!personalBudget) {
            throw new common_1.NotFoundException('Personal budget not found');
        }
        return personalBudget;
    }
    async update(userId, personalBudgetId, payload) {
        await this.findOne(userId, personalBudgetId);
        return this.prisma.personalBudget.update({
            where: { id: personalBudgetId },
            data: {
                name: payload.name,
                description: payload.description,
            },
            include: {
                items: {
                    where: { deletedAt: null },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
    }
    async delete(userId, personalBudgetId) {
        await this.findOne(userId, personalBudgetId);
        return this.prisma.personalBudget.update({
            where: { id: personalBudgetId },
            data: { deletedAt: new Date() },
        });
    }
    async addItem(userId, personalBudgetId, payload) {
        await this.findOne(userId, personalBudgetId);
        const item = await this.prisma.personalBudgetItem.create({
            data: {
                name: payload.name,
                description: payload.description,
                amount: payload.amount,
                personalBudgetId,
            },
        });
        return item;
    }
    async updateItem(userId, personalBudgetId, itemId, payload) {
        await this.findOne(userId, personalBudgetId);
        const item = await this.prisma.personalBudgetItem.findFirst({
            where: {
                id: itemId,
                personalBudgetId,
                deletedAt: null,
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Personal budget item not found');
        }
        return this.prisma.personalBudgetItem.update({
            where: { id: itemId },
            data: {
                name: payload.name,
                description: payload.description,
                amount: payload.amount,
            },
        });
    }
    async deleteItem(userId, personalBudgetId, itemId) {
        await this.findOne(userId, personalBudgetId);
        const item = await this.prisma.personalBudgetItem.findFirst({
            where: {
                id: itemId,
                personalBudgetId,
                deletedAt: null,
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Personal budget item not found');
        }
        return this.prisma.personalBudgetItem.update({
            where: { id: itemId },
            data: { deletedAt: new Date() },
        });
    }
    async getSummary(userId, personalBudgetId) {
        const personalBudget = await this.findOne(userId, personalBudgetId);
        const total = personalBudget.items.reduce((sum, item) => sum + item.amount, 0);
        const itemCount = personalBudget.items.length;
        return {
            total,
            itemCount,
        };
    }
};
exports.PersonalBudgetService = PersonalBudgetService;
exports.PersonalBudgetService = PersonalBudgetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PersonalBudgetService);
//# sourceMappingURL=personal-budget.service.js.map