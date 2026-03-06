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
exports.CreateExpenseFromTemplateDto = exports.UpdateExpenseTemplateDto = exports.CreateExpenseTemplateDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateExpenseTemplateDto {
    name;
    description;
    amount;
    categoryId;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 2, maxLength: 100 }, description: { required: false, type: () => String, maxLength: 500 }, amount: { required: true, type: () => Number, minimum: 1 }, categoryId: { required: true, type: () => String, format: "uuid" } };
    }
}
exports.CreateExpenseTemplateDto = CreateExpenseTemplateDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateExpenseTemplateDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateExpenseTemplateDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateExpenseTemplateDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateExpenseTemplateDto.prototype, "categoryId", void 0);
class UpdateExpenseTemplateDto {
    name;
    description;
    amount;
    categoryId;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String, minLength: 2, maxLength: 100 }, description: { required: false, type: () => String, maxLength: 500 }, amount: { required: false, type: () => Number, minimum: 1 }, categoryId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.UpdateExpenseTemplateDto = UpdateExpenseTemplateDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateExpenseTemplateDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateExpenseTemplateDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateExpenseTemplateDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateExpenseTemplateDto.prototype, "categoryId", void 0);
class CreateExpenseFromTemplateDto {
    templateId;
    budgetPeriodId;
    expenseGroupId;
    amount;
    name;
    static _OPENAPI_METADATA_FACTORY() {
        return { templateId: { required: true, type: () => String, format: "uuid" }, budgetPeriodId: { required: true, type: () => String, format: "uuid" }, expenseGroupId: { required: false, type: () => String, format: "uuid" }, amount: { required: false, type: () => Number, minimum: 1 }, name: { required: false, type: () => String, minLength: 2, maxLength: 100 } };
    }
}
exports.CreateExpenseFromTemplateDto = CreateExpenseFromTemplateDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateExpenseFromTemplateDto.prototype, "templateId", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateExpenseFromTemplateDto.prototype, "budgetPeriodId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateExpenseFromTemplateDto.prototype, "expenseGroupId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateExpenseFromTemplateDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateExpenseFromTemplateDto.prototype, "name", void 0);
//# sourceMappingURL=expense-template.dto.js.map