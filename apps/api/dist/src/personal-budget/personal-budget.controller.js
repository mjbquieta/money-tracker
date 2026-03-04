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
exports.PersonalBudgetController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const personal_budget_service_1 = require("./personal-budget.service");
const personal_budget_dto_1 = require("./personal-budget.dto");
const pagination_dto_1 = require("../common/dto/pagination.dto");
const swagger_1 = require("@nestjs/swagger");
let PersonalBudgetController = class PersonalBudgetController {
    personalBudgetService;
    constructor(personalBudgetService) {
        this.personalBudgetService = personalBudgetService;
    }
    findAll(userId, pagination) {
        return this.personalBudgetService.findAll(userId, pagination);
    }
    findOne(userId, id) {
        return this.personalBudgetService.findOne(userId, id);
    }
    getSummary(userId, id) {
        return this.personalBudgetService.getSummary(userId, id);
    }
    create(userId, payload) {
        return this.personalBudgetService.create(userId, payload);
    }
    update(userId, id, payload) {
        return this.personalBudgetService.update(userId, id, payload);
    }
    delete(userId, id) {
        return this.personalBudgetService.delete(userId, id);
    }
    addItem(userId, id, payload) {
        return this.personalBudgetService.addItem(userId, id, payload);
    }
    updateItem(userId, id, itemId, payload) {
        return this.personalBudgetService.updateItem(userId, id, itemId, payload);
    }
    deleteItem(userId, id, itemId) {
        return this.personalBudgetService.deleteItem(userId, id, itemId);
    }
};
exports.PersonalBudgetController = PersonalBudgetController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationQueryDto]),
    __metadata("design:returntype", void 0)
], PersonalBudgetController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PersonalBudgetController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/summary'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PersonalBudgetController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, personal_budget_dto_1.CreatePersonalBudgetDto]),
    __metadata("design:returntype", void 0)
], PersonalBudgetController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, personal_budget_dto_1.UpdatePersonalBudgetDto]),
    __metadata("design:returntype", void 0)
], PersonalBudgetController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PersonalBudgetController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, personal_budget_dto_1.CreatePersonalBudgetItemDto]),
    __metadata("design:returntype", void 0)
], PersonalBudgetController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)(':id/items/:itemId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('itemId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, personal_budget_dto_1.UpdatePersonalBudgetItemDto]),
    __metadata("design:returntype", void 0)
], PersonalBudgetController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)(':id/items/:itemId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], PersonalBudgetController.prototype, "deleteItem", null);
exports.PersonalBudgetController = PersonalBudgetController = __decorate([
    (0, swagger_1.ApiTags)('Personal Budgets'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/v1/personal-budgets'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [personal_budget_service_1.PersonalBudgetService])
], PersonalBudgetController);
//# sourceMappingURL=personal-budget.controller.js.map