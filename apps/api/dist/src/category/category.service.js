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
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const category_dto_1 = require("./category.dto");
const pagination_helper_1 = require("../common/helpers/pagination.helper");
let CategoryService = class CategoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createDefaultCategories(userId, tx) {
        const client = tx ?? this.prisma;
        const defaultCategories = Object.values(category_dto_1.DefaultCategory).map((category) => ({
            userId,
            name: category.charAt(0) + category.slice(1).toLowerCase(),
            isDefault: true,
            defaultCategory: category,
        }));
        return client.category.createMany({
            data: defaultCategories,
        });
    }
    async create(userId, payload, tx) {
        const client = tx ?? this.prisma;
        const existing = await client.category.findUnique({
            where: {
                userId_name: {
                    userId,
                    name: payload.name,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Category with this name already exists');
        }
        return client.category.create({
            data: {
                userId,
                name: payload.name,
                description: payload.description,
                spendingLimit: payload.spendingLimit,
                isDefault: false,
            },
        });
    }
    async findAll(userId, pagination) {
        const where = {
            userId,
            deletedAt: null,
        };
        const prismaArgs = (0, pagination_helper_1.buildPrismaArgs)(pagination);
        const [items, totalCount] = await Promise.all([
            this.prisma.category.findMany({
                where,
                ...prismaArgs,
                orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
            }),
            this.prisma.category.count({ where }),
        ]);
        return (0, pagination_helper_1.buildPaginatedResponse)(items, pagination, totalCount);
    }
    async findOne(userId, categoryId) {
        const category = await this.prisma.category.findFirst({
            where: {
                id: categoryId,
                userId,
                deletedAt: null,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async update(userId, categoryId, payload) {
        const category = await this.findOne(userId, categoryId);
        if (category.isDefault && payload.name) {
            throw new common_1.ConflictException('Cannot rename default categories');
        }
        if (payload.name) {
            const existing = await this.prisma.category.findFirst({
                where: {
                    userId,
                    name: payload.name,
                    id: { not: categoryId },
                    deletedAt: null,
                },
            });
            if (existing) {
                throw new common_1.ConflictException('Category with this name already exists');
            }
        }
        return this.prisma.category.update({
            where: { id: categoryId },
            data: payload,
        });
    }
    async delete(userId, categoryId) {
        const category = await this.findOne(userId, categoryId);
        if (category.isDefault) {
            throw new common_1.ConflictException('Cannot delete default categories');
        }
        return this.prisma.category.update({
            where: { id: categoryId },
            data: { deletedAt: new Date() },
        });
    }
    async getSpendingStatus(userId, categoryId, budgetPeriodId) {
        const category = await this.findOne(userId, categoryId);
        const result = await this.prisma.expense.aggregate({
            where: {
                categoryId,
                budgetPeriodId,
                deletedAt: null,
                budgetPeriod: { userId, deletedAt: null },
            },
            _sum: { amount: true },
            _count: true,
        });
        const totalSpent = result._sum.amount || 0;
        const limit = category.spendingLimit;
        return {
            categoryId,
            categoryName: category.name,
            spendingLimit: limit,
            totalSpent,
            remaining: limit ? limit - totalSpent : null,
            percentageUsed: limit ? (totalSpent / limit) * 100 : null,
            isOverLimit: limit ? totalSpent > limit : false,
            isApproachingLimit: limit ? totalSpent >= limit * 0.8 && totalSpent <= limit : false,
            expenseCount: result._count,
        };
    }
    async getAllSpendingStatus(userId, budgetPeriodId) {
        const categories = await this.prisma.category.findMany({
            where: { userId, deletedAt: null },
        });
        const expenses = await this.prisma.expense.groupBy({
            by: ['categoryId'],
            where: {
                budgetPeriodId,
                deletedAt: null,
                budgetPeriod: { userId, deletedAt: null },
            },
            _sum: { amount: true },
            _count: true,
        });
        const expenseMap = new Map(expenses.map((e) => [e.categoryId, e]));
        return categories.map((cat) => {
            const data = expenseMap.get(cat.id);
            const totalSpent = data?._sum.amount || 0;
            const limit = cat.spendingLimit;
            return {
                categoryId: cat.id,
                categoryName: cat.name,
                spendingLimit: limit,
                totalSpent,
                remaining: limit ? limit - totalSpent : null,
                percentageUsed: limit ? (totalSpent / limit) * 100 : null,
                isOverLimit: limit ? totalSpent > limit : false,
                isApproachingLimit: limit ? totalSpent >= limit * 0.8 && totalSpent <= limit : false,
                expenseCount: data?._count || 0,
            };
        });
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryService);
//# sourceMappingURL=category.service.js.map