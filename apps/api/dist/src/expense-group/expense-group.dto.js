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
exports.MoveExpensesToGroupDto = exports.AddExpensesToGroupDto = exports.UpdateExpenseGroupDto = exports.CreateExpenseGroupDto = void 0;
const class_validator_1 = require("class-validator");
class CreateExpenseGroupDto {
    name;
    description;
    budgetPeriodId;
}
exports.CreateExpenseGroupDto = CreateExpenseGroupDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateExpenseGroupDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateExpenseGroupDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateExpenseGroupDto.prototype, "budgetPeriodId", void 0);
class UpdateExpenseGroupDto {
    name;
    description;
}
exports.UpdateExpenseGroupDto = UpdateExpenseGroupDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateExpenseGroupDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateExpenseGroupDto.prototype, "description", void 0);
class AddExpensesToGroupDto {
    expenseIds;
}
exports.AddExpensesToGroupDto = AddExpensesToGroupDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], AddExpensesToGroupDto.prototype, "expenseIds", void 0);
class MoveExpensesToGroupDto {
    expenseIds;
    targetGroupId;
}
exports.MoveExpensesToGroupDto = MoveExpensesToGroupDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], MoveExpensesToGroupDto.prototype, "expenseIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", Object)
], MoveExpensesToGroupDto.prototype, "targetGroupId", void 0);
//# sourceMappingURL=expense-group.dto.js.map