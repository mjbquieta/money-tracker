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
exports.TagService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TagService = class TagService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, payload) {
        const existing = await this.prisma.tag.findFirst({
            where: { userId, name: payload.name, deletedAt: null },
        });
        if (existing) {
            throw new common_1.ConflictException('A tag with this name already exists');
        }
        return this.prisma.tag.create({
            data: {
                name: payload.name,
                color: payload.color,
                userId,
            },
        });
    }
    async findAll(userId) {
        return this.prisma.tag.findMany({
            where: { userId, deletedAt: null },
            orderBy: { name: 'asc' },
        });
    }
    async findOne(userId, tagId) {
        const tag = await this.prisma.tag.findFirst({
            where: { id: tagId, userId, deletedAt: null },
        });
        if (!tag) {
            throw new common_1.NotFoundException('Tag not found');
        }
        return tag;
    }
    async update(userId, tagId, payload) {
        await this.findOne(userId, tagId);
        if (payload.name) {
            const existing = await this.prisma.tag.findFirst({
                where: {
                    userId,
                    name: payload.name,
                    id: { not: tagId },
                    deletedAt: null,
                },
            });
            if (existing) {
                throw new common_1.ConflictException('A tag with this name already exists');
            }
        }
        return this.prisma.tag.update({
            where: { id: tagId },
            data: payload,
        });
    }
    async delete(userId, tagId) {
        await this.findOne(userId, tagId);
        return this.prisma.tag.update({
            where: { id: tagId },
            data: { deletedAt: new Date() },
        });
    }
    async tagExpense(userId, expenseId, tagIds) {
        const expense = await this.prisma.expense.findFirst({
            where: {
                id: expenseId,
                deletedAt: null,
                budgetPeriod: { userId, deletedAt: null },
            },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        const tags = await this.prisma.tag.findMany({
            where: { id: { in: tagIds }, userId, deletedAt: null },
        });
        if (tags.length !== tagIds.length) {
            throw new common_1.NotFoundException('One or more tags not found');
        }
        await this.prisma.$transaction([
            this.prisma.expenseTag.deleteMany({
                where: { expenseId },
            }),
            ...tagIds.map((tagId) => this.prisma.expenseTag.create({
                data: { expenseId, tagId },
            })),
        ]);
        return this.prisma.expense.findUnique({
            where: { id: expenseId },
            include: {
                category: true,
                expenseTags: { include: { tag: true } },
            },
        });
    }
    async getExpenseTags(userId, expenseId) {
        const expense = await this.prisma.expense.findFirst({
            where: {
                id: expenseId,
                deletedAt: null,
                budgetPeriod: { userId, deletedAt: null },
            },
            include: {
                expenseTags: { include: { tag: true } },
            },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        return expense.expenseTags.map((et) => et.tag);
    }
};
exports.TagService = TagService;
exports.TagService = TagService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TagService);
//# sourceMappingURL=tag.service.js.map