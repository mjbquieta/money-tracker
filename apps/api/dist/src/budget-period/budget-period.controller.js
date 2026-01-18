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
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const budget_period_service_1 = require("./budget-period.service");
const budget_period_dto_1 = require("./budget-period.dto");
let BudgetPeriodController = class BudgetPeriodController {
    budgetPeriodService;
    constructor(budgetPeriodService) {
        this.budgetPeriodService = budgetPeriodService;
    }
    findAll(userId) {
        return this.budgetPeriodService.findAll(userId);
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
    getSummary(userId, id) {
        return this.budgetPeriodService.getSummary(userId, id);
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
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('metrics/yearly'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "getYearlyMetrics", null);
__decorate([
    (0, common_1.Get)('metrics/overall'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "getOverallMetrics", null);
__decorate([
    (0, common_1.Get)(':id/summary'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, budget_period_dto_1.CreateBudgetPeriodDto]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/duplicate'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, budget_period_dto_1.DuplicateBudgetPeriodDto]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "duplicate", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, budget_period_dto_1.UpdateBudgetPeriodDto]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BudgetPeriodController.prototype, "delete", null);
exports.BudgetPeriodController = BudgetPeriodController = __decorate([
    (0, common_1.Controller)('api/v1/budget-periods'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [budget_period_service_1.BudgetPeriodService])
], BudgetPeriodController);
//# sourceMappingURL=budget-period.controller.js.map