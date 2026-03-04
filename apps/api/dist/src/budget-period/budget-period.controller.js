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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetPeriodController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const budget_period_service_1 = require("./budget-period.service");
const budget_period_dto_1 = require("./budget-period.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const swagger_1 = require("@nestjs/swagger");
let BudgetPeriodController = class BudgetPeriodController {
    budgetPeriodService;
    constructor(budgetPeriodService) {
        this.budgetPeriodService = budgetPeriodService;
    }
    findAll(userId, pagination) {
        return this.budgetPeriodService.findAll(userId, pagination);
    }
    findOne(userId, id) {
        return this.budgetPeriodService.findOne(userId, id);
    }
    getYearlyMetrics(userId, year) {
        const targetYear = year ? parseInt(year, 10) : new Date().getFullYear();
        return this.budgetPeriodService.getYearlyMetrics(userId, targetYear);
    }
    getOverallMetrics(userId) {
        return this.budgetPeriodService.getOverallMetrics(userId);
    }
    getYearRangeMetrics(userId, startYear, endYear) {
        const currentYear = new Date().getFullYear();
        const start = startYear ? parseInt(startYear, 10) : currentYear - 1;
        const end = endYear ? parseInt(endYear, 10) : currentYear;
        return this.budgetPeriodService.getYearRangeMetrics(userId, start, end);
    }
    getCategoryComparison(userId, budgetPeriodIds) {
        const ids = budgetPeriodIds ? budgetPeriodIds.split(',') : [];
        return this.budgetPeriodService.getCategoryComparison(userId, ids);
    }
    getSummary(userId, id) {
        return this.budgetPeriodService.getSummary(userId, id);
    }
    getDailyAverage(userId, id) {
        return this.budgetPeriodService.getAverageDailySpending(userId, id);
    }
    getTopExpenses(userId, id, limit) {
        const take = limit ? parseInt(limit, 10) : 5;
        return this.budgetPeriodService.getTopExpenses(userId, id, take);
    }
    create(userId, payload) {
        return this.budgetPeriodService.create(userId, payload);
    }
    duplicate(userId, id, payload) {
        return this.budgetPeriodService.duplicate(userId, id, payload);
    }
    update(userId, id, payload) {
        return this.budgetPeriodService.update(userId, id, payload);
    }
    delete(userId, id) {
        return this.budgetPeriodService.delete(userId, id);
    }
};
exports.BudgetPeriodController = BudgetPeriodController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('metrics/yearly'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "getYearlyMetrics", null);
__decorate([
    (0, common_1.Get)('metrics/overall'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "getOverallMetrics", null);
__decorate([
    (0, common_1.Get)('metrics/year-range'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('startYear')),
    __param(2, (0, common_1.Query)('endYear')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "getYearRangeMetrics", null);
__decorate([
    (0, common_1.Get)('analytics/category-comparison'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('budgetPeriodIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "getCategoryComparison", null);
__decorate([
    (0, common_1.Get)(':id/summary'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':id/analytics/daily-average'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "getDailyAverage", null);
__decorate([
    (0, common_1.Get)(':id/analytics/top-expenses'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "getTopExpenses", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, budget_period_dto_1.CreateBudgetPeriodDto]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/duplicate'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, budget_period_dto_1.DuplicateBudgetPeriodDto]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "duplicate", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, budget_period_dto_1.UpdateBudgetPeriodDto]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "delete", null);
exports.BudgetPeriodController = BudgetPeriodController = __decorate([
    (0, swagger_1.ApiTags)('Budget Periods'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/v1/budget-periods'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [budget_period_service_1.BudgetPeriodService])
], BudgetPeriodController);
//# sourceMappingURL=budget-period.controller.js.map