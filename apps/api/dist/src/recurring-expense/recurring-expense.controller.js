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
exports.RecurringExpenseController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const recurring_expense_service_1 = require("./recurring-expense.service");
const recurring_expense_dto_1 = require("./recurring-expense.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const swagger_1 = require("@nestjs/swagger");
let RecurringExpenseController = class RecurringExpenseController {
    recurringExpenseService;
    constructor(recurringExpenseService) {
        this.recurringExpenseService = recurringExpenseService;
    }
    findAll(userId, pagination) {
        return this.recurringExpenseService.findAll(userId, pagination);
    }
    findOne(userId, id) {
        return this.recurringExpenseService.findOne(userId, id);
    }
    create(userId, payload) {
        return this.recurringExpenseService.create(userId, payload);
    }
    generate(userId, payload) {
        return this.recurringExpenseService.generateForBudgetPeriod(userId, payload.budgetPeriodId);
    }
    update(userId, id, payload) {
        return this.recurringExpenseService.update(userId, id, payload);
    }
    delete(userId, id) {
        return this.recurringExpenseService.delete(userId, id);
    }
};
exports.RecurringExpenseController = RecurringExpenseController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], RecurringExpenseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RecurringExpenseController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, recurring_expense_dto_1.CreateRecurringExpenseDto]),
    __metadata("design:returntype", void 0)
], RecurringExpenseController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('generate'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, recurring_expense_dto_1.GenerateRecurringExpensesDto]),
    __metadata("design:returntype", void 0)
], RecurringExpenseController.prototype, "generate", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, recurring_expense_dto_1.UpdateRecurringExpenseDto]),
    __metadata("design:returntype", void 0)
], RecurringExpenseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RecurringExpenseController.prototype, "delete", null);
exports.RecurringExpenseController = RecurringExpenseController = __decorate([
    (0, swagger_1.ApiTags)('Recurring Expenses'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/v1/recurring-expenses'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [recurring_expense_service_1.RecurringExpenseService])
], RecurringExpenseController);
//# sourceMappingURL=recurring-expense.controller.js.map