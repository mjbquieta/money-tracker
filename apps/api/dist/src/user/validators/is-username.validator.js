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
exports.IsUsernameExistConstraint = void 0;
exports.IsUsernameExist = IsUsernameExist;
const class_validator_1 = require("class-validator");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let IsUsernameExistConstraint = class IsUsernameExistConstraint {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    validate(username, args) {
        return this.prisma.user
            .findUnique({
            where: {
                username,
                deletedAt: null,
            },
        })
            .then((user) => !user);
    }
};
exports.IsUsernameExistConstraint = IsUsernameExistConstraint;
exports.IsUsernameExistConstraint = IsUsernameExistConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: true }),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IsUsernameExistConstraint);
function IsUsernameExist(validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUsernameExistConstraint,
        });
    };
}
//# sourceMappingURL=is-username.validator.js.map