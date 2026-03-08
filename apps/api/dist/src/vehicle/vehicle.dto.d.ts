declare enum VehicleExpenseType {
    FUEL = "FUEL",
    MAINTENANCE = "MAINTENANCE",
    INSURANCE = "INSURANCE",
    PARKING = "PARKING",
    TOLL = "TOLL",
    ACCESSORIES = "ACCESSORIES",
    REGISTRATION = "REGISTRATION",
    WASH = "WASH",
    PARTICIPATION_FEE = "PARTICIPATION_FEE",
    OTHER = "OTHER"
}
export declare class CreateVehicleDto {
    name: string;
    make?: string;
    model?: string;
    year?: number;
    licensePlate?: string;
    notes?: string;
}
export declare class UpdateVehicleDto {
    name?: string;
    make?: string;
    model?: string;
    year?: number;
    licensePlate?: string;
    notes?: string;
}
export declare class CreateVehicleExpenseDto {
    type: VehicleExpenseType;
    amount: number;
    description?: string;
    date?: string;
    odometer?: number;
    fuelLiters?: number;
    fuelPricePerLiter?: number;
    isFullTank?: boolean;
    notes?: string;
}
export declare class UpdateVehicleExpenseDto {
    type?: VehicleExpenseType;
    amount?: number;
    description?: string;
    date?: string;
    odometer?: number;
    fuelLiters?: number;
    fuelPricePerLiter?: number;
    isFullTank?: boolean;
    notes?: string;
}
export {};
