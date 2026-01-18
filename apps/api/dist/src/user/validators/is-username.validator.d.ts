import { ValidationOptions, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class IsUsernameExistConstraint implements ValidatorConstraintInterface {
    protected readonly prisma: PrismaService;
    constructor(prisma: PrismaService);
    validate(username: string, args: ValidationArguments): Promise<boolean>;
}
export declare function IsUsernameExist(validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
