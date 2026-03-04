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
exports.ExpenseTemplateController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const expense_template_service_1 = require("./expense-template.service");
const expense_template_dto_1 = require("./expense-template.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const swagger_1 = require("@nestjs/swagger");
let ExpenseTemplateController = class ExpenseTemplateController {
    expenseTemplateService;
    constructor(expenseTemplateService) {
        this.expenseTemplateService = expenseTemplateService;
    }
    findAll(userId, pagination) {
        return this.expenseTemplateService.findAll(userId, pagination);
    }
    findOne(userId, id) {
        return this.expenseTemplateService.findOne(userId, id);
    }
    create(userId, payload) {
        return this.expenseTemplateService.create(userId, payload);
    }
    createExpenseFromTemplate(userId, payload) {
        return this.expenseTemplateService.createExpenseFromTemplate(userId, payload);
    }
    update(userId, id, payload) {
        return this.expenseTemplateService.update(userId, id, payload);
    }
    delete(userId, id) {
        return this.expenseTemplateService.delete(userId, id);
    }
};
exports.ExpenseTemplateController = ExpenseTemplateController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], ExpenseTemplateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExpenseTemplateController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, expense_template_dto_1.CreateExpenseTemplateDto]),
    __metadata("design:returntype", void 0)
], ExpenseTemplateController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('create-expense'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, expense_template_dto_1.CreateExpenseFromTemplateDto]),
    __metadata("design:returntype", void 0)
], ExpenseTemplateController.prototype, "createExpenseFromTemplate", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, expense_template_dto_1.UpdateExpenseTemplateDto]),
    __metadata("design:returntype", void 0)
], ExpenseTemplateController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExpenseTemplateController.prototype, "delete", null);
exports.ExpenseTemplateController = ExpenseTemplateController = __decorate([
    (0, swagger_1.ApiTags)('Expense Templates'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/v1/expense-templates'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [expense_template_service_1.ExpenseTemplateService])
], ExpenseTemplateController);
//# sourceMappingURL=expense-template.controller.js.map