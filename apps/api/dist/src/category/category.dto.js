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
exports.DefaultCategory = exports.UpdateCategoryDto = exports.CreateCategoryDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var DefaultCategory;
(function (DefaultCategory) {
    DefaultCategory["BILLS"] = "BILLS";
    DefaultCategory["FOOD"] = "FOOD";
    DefaultCategory["TRANSPORT"] = "TRANSPORT";
    DefaultCategory["SAVINGS"] = "SAVINGS";
    DefaultCategory["ENTERTAINMENT"] = "ENTERTAINMENT";
})(DefaultCategory || (exports.DefaultCategory = DefaultCategory = {}));
class CreateCategoryDto {
    name;
    description;
    spendingLimit;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 2, maxLength: 50 }, description: { required: false, type: () => String, maxLength: 200 }, spendingLimit: { required: false, type: () => Number, minimum: 1 } };
    }
}
exports.CreateCategoryDto = CreateCategoryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateCategoryDto.prototype, "spendingLimit", void 0);
class UpdateCategoryDto {
    name;
    description;
    spendingLimit;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String, minLength: 2, maxLength: 50 }, description: { required: false, type: () => String, maxLength: 200 }, spendingLimit: { required: false, type: () => Number, nullable: true, minimum: 0 } };
    }
}
exports.UpdateCategoryDto = UpdateCategoryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateCategoryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateCategoryDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Object)
], UpdateCategoryDto.prototype, "spendingLimit", void 0);
//# sourceMappingURL=category.dto.js.map