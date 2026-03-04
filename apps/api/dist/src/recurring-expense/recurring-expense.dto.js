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
exports.RecurrenceFrequency = exports.GenerateRecurringExpensesDto = exports.UpdateRecurringExpenseDto = exports.CreateRecurringExpenseDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var RecurrenceFrequency;
(function (RecurrenceFrequency) {
    RecurrenceFrequency["DAILY"] = "DAILY";
    RecurrenceFrequency["WEEKLY"] = "WEEKLY";
    RecurrenceFrequency["BIWEEKLY"] = "BIWEEKLY";
    RecurrenceFrequency["MONTHLY"] = "MONTHLY";
    RecurrenceFrequency["YEARLY"] = "YEARLY";
})(RecurrenceFrequency || (exports.RecurrenceFrequency = RecurrenceFrequency = {}));
class CreateRecurringExpenseDto {
    name;
    description;
    amount;
    categoryId;
    frequency;
    startDate;
    endDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 2, maxLength: 100 }, description: { required: false, type: () => String, maxLength: 500 }, amount: { required: true, type: () => Number, minimum: 1 }, categoryId: { required: true, type: () => String, format: "uuid" }, frequency: { required: true, enum: require("./recurring-expense.dto").RecurrenceFrequency }, startDate: { required: true, type: () => String }, endDate: { required: false, type: () => String } };
    }
}
exports.CreateRecurringExpenseDto = CreateRecurringExpenseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateRecurringExpenseDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateRecurringExpenseDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateRecurringExpenseDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateRecurringExpenseDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(RecurrenceFrequency),
    __metadata("design:type", String)
], CreateRecurringExpenseDto.prototype, "frequency", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateRecurringExpenseDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateRecurringExpenseDto.prototype, "endDate", void 0);
class UpdateRecurringExpenseDto {
    name;
    description;
    amount;
    categoryId;
    frequency;
    startDate;
    endDate;
    isActive;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String, minLength: 2, maxLength: 100 }, description: { required: false, type: () => String, maxLength: 500 }, amount: { required: false, type: () => Number, minimum: 1 }, categoryId: { required: false, type: () => String, format: "uuid" }, frequency: { required: false, enum: require("./recurring-expense.dto").RecurrenceFrequency }, startDate: { required: false, type: () => String }, endDate: { required: false, type: () => String, nullable: true }, isActive: { required: false, type: () => Boolean } };
    }
}
exports.UpdateRecurringExpenseDto = UpdateRecurringExpenseDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateRecurringExpenseDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateRecurringExpenseDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateRecurringExpenseDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateRecurringExpenseDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(RecurrenceFrequency),
    __metadata("design:type", String)
], UpdateRecurringExpenseDto.prototype, "frequency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateRecurringExpenseDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Object)
], UpdateRecurringExpenseDto.prototype, "endDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateRecurringExpenseDto.prototype, "isActive", void 0);
class GenerateRecurringExpensesDto {
    budgetPeriodId;
    static _OPENAPI_METADATA_FACTORY() {
        return { budgetPeriodId: { required: true, type: () => String, format: "uuid" } };
    }
}
exports.GenerateRecurringExpensesDto = GenerateRecurringExpensesDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GenerateRecurringExpensesDto.prototype, "budgetPeriodId", void 0);
//# sourceMappingURL=recurring-expense.dto.js.map