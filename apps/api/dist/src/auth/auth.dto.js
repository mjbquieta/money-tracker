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
exports.LoginDto = exports.IsUsernameOrEmailProvidedConstraint = void 0;
exports.IsUsernameOrEmailProvided = IsUsernameOrEmailProvided;
const class_validator_1 = require("class-validator");
let IsUsernameOrEmailProvidedConstraint = class IsUsernameOrEmailProvidedConstraint {
    validate(value, args) {
        const object = args.object;
        const hasUsername = !!object.username;
        const hasEmail = !!object.email;
        return hasUsername !== hasEmail;
    }
    defaultMessage(args) {
        const object = args.object;
        if (object.username && object.email) {
            return 'Provide either username or email, not both';
        }
        return 'Either username or email must be provided';
    }
};
exports.IsUsernameOrEmailProvidedConstraint = IsUsernameOrEmailProvidedConstraint;
exports.IsUsernameOrEmailProvidedConstraint = IsUsernameOrEmailProvidedConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ name: 'isUsernameOrEmailProvided', async: false })
], IsUsernameOrEmailProvidedConstraint);
function IsUsernameOrEmailProvided(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUsernameOrEmailProvidedConstraint,
        });
    };
}
class LoginDto {
    username;
    email;
    password;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], LoginDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    IsUsernameOrEmailProvided(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
//# sourceMappingURL=auth.dto.js.map