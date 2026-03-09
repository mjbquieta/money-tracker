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
exports.ExportController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const two_factor_auth_guard_1 = require("../auth/two-factor-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const export_service_1 = require("./export.service");
const export_dto_1 = require("./export.dto");
const swagger_1 = require("@nestjs/swagger");
let ExportController = class ExportController {
    exportService;
    constructor(exportService) {
        this.exportService = exportService;
    }
    async exportCsv(userId, id, res) {
        const csv = await this.exportService.exportBudgetPeriodCsv(userId, id);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=budget-period-${id}.csv`);
        res.send(csv);
    }
    async importExpenses(userId, payload) {
        return this.exportService.importExpensesCsv(userId, payload.budgetPeriodId, payload.records);
    }
    async exportVehicleCsv(userId, id, res) {
        const csv = await this.exportService.exportVehicleExpensesCsv(userId, id);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=vehicle-${id}.csv`);
        res.send(csv);
    }
    async importVehicleExpenses(userId, payload) {
        return this.exportService.importVehicleExpensesCsv(userId, payload.vehicleId, payload.records);
    }
};
exports.ExportController = ExportController;
__decorate([
    (0, common_1.Get)('export/budget-periods/:id/csv'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "exportCsv", null);
__decorate([
    (0, common_1.Post)('import/expenses'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, export_dto_1.ImportExpensesDto]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "importExpenses", null);
__decorate([
    (0, common_1.Get)('export/vehicles/:id/csv'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "exportVehicleCsv", null);
__decorate([
    (0, common_1.Post)('import/vehicle-expenses'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, export_dto_1.ImportVehicleExpensesDto]),
    __metadata("design:returntype", Promise)
], ExportController.prototype, "importVehicleExpenses", null);
exports.ExportController = ExportController = __decorate([
    (0, swagger_1.ApiTags)('Export / Import'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/v1'),
    (0, common_1.UseGuards)(two_factor_auth_guard_1.TwoFactorAuthGuard),
    __metadata("design:paramtypes", [export_service_1.ExportService])
], ExportController);
//# sourceMappingURL=export.controller.js.map