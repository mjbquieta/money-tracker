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
exports.FinancialGoalController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const two_factor_auth_guard_1 = require("../auth/two-factor-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const financial_goal_service_1 = require("./financial-goal.service");
const financial_goal_dto_1 = require("./financial-goal.dto");
const swagger_1 = require("@nestjs/swagger");
let FinancialGoalController = class FinancialGoalController {
    financialGoalService;
    constructor(financialGoalService) {
        this.financialGoalService = financialGoalService;
    }
    findAll(userId) {
        return this.financialGoalService.findAll(userId);
    }
    getSummary(userId) {
        return this.financialGoalService.getSummary(userId);
    }
    findOne(userId, id) {
        return this.financialGoalService.findOne(userId, id);
    }
    create(userId, payload) {
        return this.financialGoalService.create(userId, payload);
    }
    update(userId, id, payload) {
        return this.financialGoalService.update(userId, id, payload);
    }
    delete(userId, id) {
        return this.financialGoalService.delete(userId, id);
    }
    addContribution(userId, id, payload) {
        return this.financialGoalService.addContribution(userId, id, payload);
    }
    deleteContribution(userId, id, contributionId) {
        return this.financialGoalService.deleteContribution(userId, id, contributionId);
    }
};
exports.FinancialGoalController = FinancialGoalController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinancialGoalController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinancialGoalController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinancialGoalController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, financial_goal_dto_1.CreateFinancialGoalDto]),
    __metadata("design:returntype", void 0)
], FinancialGoalController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, financial_goal_dto_1.UpdateFinancialGoalDto]),
    __metadata("design:returntype", void 0)
], FinancialGoalController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FinancialGoalController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/contributions'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, financial_goal_dto_1.CreateGoalContributionDto]),
    __metadata("design:returntype", void 0)
], FinancialGoalController.prototype, "addContribution", null);
__decorate([
    (0, common_1.Delete)(':id/contributions/:contributionId'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('contributionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], FinancialGoalController.prototype, "deleteContribution", null);
exports.FinancialGoalController = FinancialGoalController = __decorate([
    (0, swagger_1.ApiTags)('Financial Goals'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/v1/financial-goals'),
    (0, common_1.UseGuards)(two_factor_auth_guard_1.TwoFactorAuthGuard),
    __metadata("design:paramtypes", [financial_goal_service_1.FinancialGoalService])
], FinancialGoalController);
//# sourceMappingURL=financial-goal.controller.js.map