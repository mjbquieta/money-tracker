import { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';
export declare class IsUsernameOrEmailProvidedConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): "Provide either username or email, not both" | "Either username or email must be provided";
}
export declare function IsUsernameOrEmailProvided(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
declare class LoginDto {
    username?: string;
    email?: string;
    password: string;
}
export declare class VerifyTwoFactorDto {
    code: string;
}
export declare class DisableTwoFactorDto {
    password: string;
    code: string;
}
export declare class TwoFactorAuthenticateDto {
    code: string;
    isBackupCode?: boolean;
}
export { LoginDto };
