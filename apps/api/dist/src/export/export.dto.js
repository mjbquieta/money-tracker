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
exports.ImportExpensesDto = exports.ImportExpenseRecord = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ImportExpenseRecord {
    name;
    description;
    amount;
    categoryName;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 1 }, description: { required: false, type: () => String }, amount: { required: true, type: () => Number, minimum: 1 }, categoryName: { required: true, type: () => String, minLength: 1 } };
    }
}
exports.ImportExpenseRecord = ImportExpenseRecord;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], ImportExpenseRecord.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImportExpenseRecord.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], ImportExpenseRecord.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], ImportExpenseRecord.prototype, "categoryName", void 0);
class ImportExpensesDto {
    budgetPeriodId;
    records;
    static _OPENAPI_METADATA_FACTORY() {
        return { budgetPeriodId: { required: true, type: () => String, format: "uuid" }, records: { required: true, type: () => [require("./export.dto").ImportExpenseRecord] } };
    }
}
exports.ImportExpensesDto = ImportExpensesDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ImportExpensesDto.prototype, "budgetPeriodId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ImportExpenseRecord),
    __metadata("design:type", Array)
], ImportExpensesDto.prototype, "records", void 0);
//# sourceMappingURL=export.dto.js.map