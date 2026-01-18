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
exports.ExpenseGroupController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const expense_group_service_1 = require("./expense-group.service");
const expense_group_dto_1 = require("./expense-group.dto");
let ExpenseGroupController = class ExpenseGroupController {
    expenseGroupService;
    constructor(expenseGroupService) {
        this.expenseGroupService = expenseGroupService;
    }
    findAll(userId, budgetPeriodId) {
        return this.expenseGroupService.findAll(userId, budgetPeriodId);
    }
    findOne(userId, id) {
        return this.expenseGroupService.findOne(userId, id);
    }
    create(userId, payload) {
        return this.expenseGroupService.create(userId, payload);
    }
    update(userId, id, payload) {
        return this.expenseGroupService.update(userId, id, payload);
    }
    delete(userId, id) {
        return this.expenseGroupService.delete(userId, id);
    }
    addExpenses(userId, id, payload) {
        return this.expenseGroupService.addExpenses(userId, id, payload);
    }
    moveExpenses(userId, payload) {
        return this.expenseGroupService.moveExpenses(userId, payload);
    }
    removeExpenseFromGroup(userId, expenseId) {
        return this.expenseGroupService.removeExpenseFromGroup(userId, expenseId);
    }
};
exports.ExpenseGroupController = ExpenseGroupController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)('budgetPeriodId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExpenseGroupController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExpenseGroupController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, expense_group_dto_1.CreateExpenseGroupDto]),
    __metadata("design:returntype", void 0)
], ExpenseGroupController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, expense_group_dto_1.UpdateExpenseGroupDto]),
    __metadata("design:returntype", void 0)
], ExpenseGroupController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExpenseGroupController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/expenses'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, expense_group_dto_1.AddExpensesToGroupDto]),
    __metadata("design:returntype", void 0)
], ExpenseGroupController.prototype, "addExpenses", null);
__decorate([
    (0, common_1.Post)('move-expenses'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, expense_group_dto_1.MoveExpensesToGroupDto]),
    __metadata("design:returntype", void 0)
], ExpenseGroupController.prototype, "moveExpenses", null);
__decorate([
    (0, common_1.Delete)('expenses/:expenseId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('expenseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExpenseGroupController.prototype, "removeExpenseFromGroup", null);
exports.ExpenseGroupController = ExpenseGroupController = __decorate([
    (0, common_1.Controller)('api/v1/expense-groups'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [expense_group_service_1.ExpenseGroupService])
], ExpenseGroupController);
//# sourceMappingURL=expense-group.controller.js.map