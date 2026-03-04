"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialGoalModule = void 0;
const common_1 = require("@nestjs/common");
const financial_goal_controller_1 = require("./financial-goal.controller");
const financial_goal_service_1 = require("./financial-goal.service");
let FinancialGoalModule = class FinancialGoalModule {
};
exports.FinancialGoalModule = FinancialGoalModule;
exports.FinancialGoalModule = FinancialGoalModule = __decorate([
    (0, common_1.Module)({
        controllers: [financial_goal_controller_1.FinancialGoalController],
        providers: [financial_goal_service_1.FinancialGoalService],
        exports: [financial_goal_service_1.FinancialGoalService],
    })
], FinancialGoalModule);
//# sourceMappingURL=financial-goal.module.js.map