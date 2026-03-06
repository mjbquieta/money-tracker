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
exports.ExpenseTemplateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const pagination_helper_1 = require("../common/helpers/pagination.helper");
let ExpenseTemplateService = class ExpenseTemplateService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, payload) {
        const category = await this.prisma.category.findFirst({
            where: { id: payload.categoryId, userId, deletedAt: null },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return this.prisma.expenseTemplate.create({
            data: {
                name: payload.name,
                description: payload.description,
                amount: payload.amount,
                categoryId: payload.categoryId,
                userId,
            },
            include: { category: true },
        });
    }
    async findAll(userId, pagination) {
        const where = { userId, deletedAt: null };
        const prismaArgs = (0, pagination_helper_1.buildPrismaArgs)(pagination);
        const [items, totalCount] = await Promise.all([
            this.prisma.expenseTemplate.findMany({
                where,
                include: { category: true },
                ...prismaArgs,
            }),
            this.prisma.expenseTemplate.count({ where }),
        ]);
        return (0, pagination_helper_1.buildPaginatedResponse)(items, pagination, totalCount);
    }
    async findOne(userId, templateId) {
        const template = await this.prisma.expenseTemplate.findFirst({
            where: { id: templateId, userId, deletedAt: null },
            include: { category: true },
        });
        if (!template) {
            throw new common_1.NotFoundException('Expense template not found');
        }
        return template;
    }
    async update(userId, templateId, payload) {
        await this.findOne(userId, templateId);
        if (payload.categoryId) {
            const category = await this.prisma.category.findFirst({
                where: { id: payload.categoryId, userId, deletedAt: null },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
        }
        return this.prisma.expenseTemplate.update({
            where: { id: templateId },
            data: payload,
            include: { category: true },
        });
    }
    async delete(userId, templateId) {
        await this.findOne(userId, templateId);
        return this.prisma.expenseTemplate.update({
            where: { id: templateId },
            data: { deletedAt: new Date() },
        });
    }
    async createExpenseFromTemplate(userId, payload) {
        const template = await this.findOne(userId, payload.templateId);
        const budgetPeriod = await this.prisma.budgetPeriod.findFirst({
            where: { id: payload.budgetPeriodId, userId, deletedAt: null },
        });
        if (!budgetPeriod) {
            throw new common_1.NotFoundException('Budget period not found');
        }
        if (payload.expenseGroupId) {
            const group = await this.prisma.expenseGroup.findFirst({
                where: {
                    id: payload.expenseGroupId,
                    budgetPeriodId: payload.budgetPeriodId,
                    deletedAt: null,
                },
            });
            if (!group) {
                throw new common_1.NotFoundException('Expense group not found');
            }
        }
        return this.prisma.expense.create({
            data: {
                name: payload.name || template.name,
                description: template.description,
                amount: payload.amount || template.amount,
                categoryId: template.categoryId,
                budgetPeriodId: payload.budgetPeriodId,
                expenseGroupId: payload.expenseGroupId,
            },
            include: { category: true },
        });
    }
};
exports.ExpenseTemplateService = ExpenseTemplateService;
exports.ExpenseTemplateService = ExpenseTemplateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpenseTemplateService);
//# sourceMappingURL=expense-template.service.js.map