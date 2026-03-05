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
exports.CreateDebtPaymentDto = exports.UpdateDebtDto = exports.CreateDebtDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var DebtType;
(function (DebtType) {
    DebtType["I_OWE"] = "I_OWE";
    DebtType["OWED_TO_ME"] = "OWED_TO_ME";
})(DebtType || (DebtType = {}));
var DebtStatus;
(function (DebtStatus) {
    DebtStatus["ACTIVE"] = "ACTIVE";
    DebtStatus["SETTLED"] = "SETTLED";
    DebtStatus["CANCELLED"] = "CANCELLED";
})(DebtStatus || (DebtStatus = {}));
class CreateDebtDto {
    type;
    counterparty;
    description;
    amount;
    dueDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: DebtType }, counterparty: { required: true, type: () => String, minLength: 1, maxLength: 100 }, description: { required: false, type: () => String, maxLength: 500 }, amount: { required: true, type: () => Number, minimum: 1 }, dueDate: { required: false, type: () => String } };
    }
}
exports.CreateDebtDto = CreateDebtDto;
__decorate([
    (0, class_validator_1.IsEnum)(DebtType),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "counterparty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateDebtDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateDebtDto.prototype, "dueDate", void 0);
class UpdateDebtDto {
    counterparty;
    description;
    amount;
    dueDate;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { counterparty: { required: false, type: () => String, minLength: 1, maxLength: 100 }, description: { required: false, type: () => String, maxLength: 500 }, amount: { required: false, type: () => Number, minimum: 1 }, dueDate: { required: false, type: () => String }, status: { required: false, enum: DebtStatus } };
    }
}
exports.UpdateDebtDto = UpdateDebtDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateDebtDto.prototype, "counterparty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateDebtDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateDebtDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateDebtDto.prototype, "dueDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(DebtStatus),
    __metadata("design:type", String)
], UpdateDebtDto.prototype, "status", void 0);
class CreateDebtPaymentDto {
    amount;
    note;
    static _OPENAPI_METADATA_FACTORY() {
        return { amount: { required: true, type: () => Number, minimum: 1 }, note: { required: false, type: () => String, maxLength: 200 } };
    }
}
exports.CreateDebtPaymentDto = CreateDebtPaymentDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateDebtPaymentDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateDebtPaymentDto.prototype, "note", void 0);
//# sourceMappingURL=debt.dto.js.map