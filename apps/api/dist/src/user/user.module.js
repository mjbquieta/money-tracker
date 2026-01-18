"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_controller_1 = require("./user.controller");
const user_service_1 = require("./user.service");
const config_1 = require("@nestjs/config");
const is_email_validator_1 = require("./validators/is-email.validator");
const is_username_validator_1 = require("./validators/is-username.validator");
const settings_module_1 = require("../settings/settings.module");
const category_module_1 = require("../category/category.module");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, settings_module_1.SettingsModule, category_module_1.CategoryModule],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService, is_email_validator_1.IsEmailExistConstraint, is_username_validator_1.IsUsernameExistConstraint],
        exports: [user_service_1.UserService],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map