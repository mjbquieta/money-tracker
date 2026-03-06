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
exports.DebtController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const two_factor_auth_guard_1 = require("../auth/two-factor-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const debt_service_1 = require("./debt.service");
const debt_dto_1 = require("./debt.dto");
const swagger_1 = require("@nestjs/swagger");
let DebtController = class DebtController {
    debtService;
    constructor(debtService) {
        this.debtService = debtService;
    }
    findAll(userId) {
        return this.debtService.findAll(userId);
    }
    getSummary(userId) {
        return this.debtService.getSummary(userId);
    }
    findOne(userId, id) {
        return this.debtService.findOne(userId, id);
    }
    create(userId, payload) {
        return this.debtService.create(userId, payload);
    }
    update(userId, id, payload) {
        return this.debtService.update(userId, id, payload);
    }
    delete(userId, id) {
        return this.debtService.delete(userId, id);
    }
    addPayment(userId, id, payload) {
        return this.debtService.addPayment(userId, id, payload);
    }
    deletePayment(userId, id, paymentId) {
        return this.debtService.deletePayment(userId, id, paymentId);
    }
};
exports.DebtController = DebtController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DebtController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('summary'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DebtController.prototype, "getSummary", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DebtController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, debt_dto_1.CreateDebtDto]),
    __metadata("design:returntype", void 0)
], DebtController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, debt_dto_1.UpdateDebtDto]),
    __metadata("design:returntype", void 0)
], DebtController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DebtController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)(':id/payments'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, debt_dto_1.CreateDebtPaymentDto]),
    __metadata("design:returntype", void 0)
], DebtController.prototype, "addPayment", null);
__decorate([
    (0, common_1.Delete)(':id/payments/:paymentId'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('paymentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], DebtController.prototype, "deletePayment", null);
exports.DebtController = DebtController = __decorate([
    (0, swagger_1.ApiTags)('Debts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/v1/debts'),
    (0, common_1.UseGuards)(two_factor_auth_guard_1.TwoFactorAuthGuard),
    __metadata("design:paramtypes", [debt_service_1.DebtService])
], DebtController);
//# sourceMappingURL=debt.controller.js.map