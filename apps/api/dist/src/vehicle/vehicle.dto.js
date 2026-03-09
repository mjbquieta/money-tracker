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
exports.UpdateVehicleExpenseDto = exports.CreateVehicleExpenseDto = exports.UpdateVehicleDto = exports.CreateVehicleDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var VehicleExpenseType;
(function (VehicleExpenseType) {
    VehicleExpenseType["FUEL"] = "FUEL";
    VehicleExpenseType["MAINTENANCE"] = "MAINTENANCE";
    VehicleExpenseType["INSURANCE"] = "INSURANCE";
    VehicleExpenseType["PARKING"] = "PARKING";
    VehicleExpenseType["TOLL"] = "TOLL";
    VehicleExpenseType["ACCESSORIES"] = "ACCESSORIES";
    VehicleExpenseType["REGISTRATION"] = "REGISTRATION";
    VehicleExpenseType["WASH"] = "WASH";
    VehicleExpenseType["PARTICIPATION_FEE"] = "PARTICIPATION_FEE";
    VehicleExpenseType["OTHER"] = "OTHER";
})(VehicleExpenseType || (VehicleExpenseType = {}));
class CreateVehicleDto {
    name;
    make;
    model;
    year;
    licensePlate;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 1, maxLength: 100 }, make: { required: false, type: () => String, maxLength: 50 }, model: { required: false, type: () => String, maxLength: 50 }, year: { required: false, type: () => Number, minimum: 1900 }, licensePlate: { required: false, type: () => String, maxLength: 20 }, notes: { required: false, type: () => String, maxLength: 500 } };
    }
}
exports.CreateVehicleDto = CreateVehicleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "make", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "model", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "licensePlate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "notes", void 0);
class UpdateVehicleDto {
    name;
    make;
    model;
    year;
    licensePlate;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String, minLength: 1, maxLength: 100 }, make: { required: false, type: () => String, maxLength: 50 }, model: { required: false, type: () => String, maxLength: 50 }, year: { required: false, type: () => Number, minimum: 1900 }, licensePlate: { required: false, type: () => String, maxLength: 20 }, notes: { required: false, type: () => String, maxLength: 500 } };
    }
}
exports.UpdateVehicleDto = UpdateVehicleDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], UpdateVehicleDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateVehicleDto.prototype, "make", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateVehicleDto.prototype, "model", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    __metadata("design:type", Number)
], UpdateVehicleDto.prototype, "year", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], UpdateVehicleDto.prototype, "licensePlate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateVehicleDto.prototype, "notes", void 0);
class CreateVehicleExpenseDto {
    type;
    amount;
    description;
    date;
    odometer;
    fuelLiters;
    fuelPricePerLiter;
    isFullTank;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: VehicleExpenseType }, amount: { required: true, type: () => Number, minimum: 1 }, description: { required: false, type: () => String, maxLength: 200 }, date: { required: false, type: () => String }, odometer: { required: false, type: () => Number, minimum: 0 }, fuelLiters: { required: false, type: () => Number, minimum: 1 }, fuelPricePerLiter: { required: false, type: () => Number, minimum: 1 }, isFullTank: { required: false, type: () => Boolean }, notes: { required: false, type: () => String, maxLength: 500 } };
    }
}
exports.CreateVehicleExpenseDto = CreateVehicleExpenseDto;
__decorate([
    (0, class_validator_1.IsEnum)(VehicleExpenseType),
    __metadata("design:type", String)
], CreateVehicleExpenseDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateVehicleExpenseDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateVehicleExpenseDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateVehicleExpenseDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateVehicleExpenseDto.prototype, "odometer", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateVehicleExpenseDto.prototype, "fuelLiters", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateVehicleExpenseDto.prototype, "fuelPricePerLiter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateVehicleExpenseDto.prototype, "isFullTank", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateVehicleExpenseDto.prototype, "notes", void 0);
class UpdateVehicleExpenseDto {
    type;
    amount;
    description;
    date;
    odometer;
    fuelLiters;
    fuelPricePerLiter;
    isFullTank;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: false, enum: VehicleExpenseType }, amount: { required: false, type: () => Number, minimum: 1 }, description: { required: false, type: () => String, maxLength: 200 }, date: { required: false, type: () => String }, odometer: { required: false, type: () => Number, minimum: 0 }, fuelLiters: { required: false, type: () => Number, minimum: 1 }, fuelPricePerLiter: { required: false, type: () => Number, minimum: 1 }, isFullTank: { required: false, type: () => Boolean }, notes: { required: false, type: () => String, maxLength: 500 } };
    }
}
exports.UpdateVehicleExpenseDto = UpdateVehicleExpenseDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(VehicleExpenseType),
    __metadata("design:type", String)
], UpdateVehicleExpenseDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateVehicleExpenseDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateVehicleExpenseDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateVehicleExpenseDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateVehicleExpenseDto.prototype, "odometer", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateVehicleExpenseDto.prototype, "fuelLiters", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], UpdateVehicleExpenseDto.prototype, "fuelPricePerLiter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateVehicleExpenseDto.prototype, "isFullTank", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateVehicleExpenseDto.prototype, "notes", void 0);
//# sourceMappingURL=vehicle.dto.js.map