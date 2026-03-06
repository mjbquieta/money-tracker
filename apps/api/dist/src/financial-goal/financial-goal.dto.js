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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGoalContributionDto = exports.UpdateFinancialGoalDto = exports.CreateFinancialGoalDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var GoalStatus;
(function (GoalStatus) {
    GoalStatus["ACTIVE"] = "ACTIVE";
    GoalStatus["COMPLETED"] = "COMPLETED";
    GoalStatus["PAUSED"] = "PAUSED";
    GoalStatus["CANCELLED"] = "CANCELLED";
})(GoalStatus || (GoalStatus = {}));
class CreateFinancialGoalDto {
    name;
    description;
    targetAmount;
    targetDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 2, maxLength: 100 }, description: { required: false, type: () => String, maxLength: 500 }, targetAmount: { required: true, type: () => Number, minimum: 1 }, targetDate: { required: false, type: () => String } };
    }
}
exports.CreateFinancialGoalDto = CreateFinancialGoalDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateFinancialGoalDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateFinancialGoalDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateFinancialGoalDto.prototype, "targetAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateFinancialGoalDto.prototype, "targetDate", void 0);
class UpdateFinancialGoalDto {
    name;
    description;
    targetAmount;
    targetDate;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String, minLength: 2, maxLength: 100 }, description: { required: false, type: () => String, maxLength: 500 }, targetAmount: { required: false, type: () => Number, minimum: 1 }, targetDate: { required: false, type: () => String }, status: { required: false, enum: GoalStatus } };
    }
}
exports.UpdateFinancialGoalDto = UpdateFinancialGoalDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateFinancialGoalDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateFinancialGoalDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateFinancialGoalDto.prototype, "targetAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateFinancialGoalDto.prototype, "targetDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(GoalStatus),
    __metadata("design:type", String)
], UpdateFinancialGoalDto.prototype, "status", void 0);
class CreateGoalContributionDto {
    amount;
    note;
    static _OPENAPI_METADATA_FACTORY() {
        return { amount: { required: true, type: () => Number, minimum: 1 }, note: { required: false, type: () => String, maxLength: 200 } };
    }
}
exports.CreateGoalContributionDto = CreateGoalContributionDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateGoalContributionDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateGoalContributionDto.prototype, "note", void 0);
//# sourceMappingURL=financial-goal.dto.js.map