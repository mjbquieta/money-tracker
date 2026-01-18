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
exports.Currency = exports.UpdateSettingsDto = exports.SettingsDto = void 0;
const class_validator_1 = require("class-validator");
var Currency;
(function (Currency) {
    Currency["PHP"] = "PHP";
    Currency["USD"] = "USD";
    Currency["EUR"] = "EUR";
    Currency["GBP"] = "GBP";
    Currency["JPY"] = "JPY";
    Currency["AUD"] = "AUD";
    Currency["CAD"] = "CAD";
    Currency["SGD"] = "SGD";
})(Currency || (exports.Currency = Currency = {}));
class SettingsDto {
    currency;
}
exports.SettingsDto = SettingsDto;
__decorate([
    (0, class_validator_1.IsEnum)(Currency),
    __metadata("design:type", String)
], SettingsDto.prototype, "currency", void 0);
class UpdateSettingsDto {
    currency;
}
exports.UpdateSettingsDto = UpdateSettingsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(Currency),
    __metadata("design:type", String)
], UpdateSettingsDto.prototype, "currency", void 0);
//# sourceMappingURL=settings.dto.js.map