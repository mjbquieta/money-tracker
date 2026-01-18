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
exports.UserPartialDto = exports.BaseUserDto = exports.CreateUserWithSettingsDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const is_email_validator_1 = require("./validators/is-email.validator");
const is_username_validator_1 = require("./validators/is-username.validator");
const settings_dto_1 = require("../settings/settings.dto");
const income_source_dto_1 = require("../income-source/income-source.dto");
class BaseUserDto {
    email;
    name;
    username;
    password;
}
exports.BaseUserDto = BaseUserDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, is_email_validator_1.IsEmailExist)({ message: 'Email is taken' }),
    __metadata("design:type", String)
], BaseUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], BaseUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, is_username_validator_1.IsUsernameExist)({ message: 'Username is taken' }),
    __metadata("design:type", String)
], BaseUserDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsStrongPassword)({
        minLength: 4,
        minNumbers: 1,
        minSymbols: 1,
        minLowercase: 1,
        minUppercase: 1,
    }),
    __metadata("design:type", String)
], BaseUserDto.prototype, "password", void 0);
class CreateUserWithSettingsDto extends BaseUserDto {
    settings;
    incomeSource;
}
exports.CreateUserWithSettingsDto = CreateUserWithSettingsDto;
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => settings_dto_1.SettingsDto),
    __metadata("design:type", settings_dto_1.SettingsDto)
], CreateUserWithSettingsDto.prototype, "settings", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => income_source_dto_1.IncomeSourceDto),
    __metadata("design:type", income_source_dto_1.IncomeSourceDto)
], CreateUserWithSettingsDto.prototype, "incomeSource", void 0);
class UserPartialDto extends (0, mapped_types_1.PartialType)(BaseUserDto) {
}
exports.UserPartialDto = UserPartialDto;
//# sourceMappingURL=user.dto.js.map