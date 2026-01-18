import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class IsEmailExistConstraint implements ValidatorConstraintInterface {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    validate(email: string, args: ValidationArguments): Promise<boolean>;
}
export declare function IsEmailExist(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
