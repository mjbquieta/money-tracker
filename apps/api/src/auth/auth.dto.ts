import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isUsernameOrEmailProvided', async: false })
export class IsUsernameOrEmailProvidedConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const object = args.object as any;
    const hasUsername = !!object.username;
    const hasEmail = !!object.email;

    // Exactly one of username or email must be provided (XOR)
    return hasUsername !== hasEmail;
  }

  defaultMessage(args: ValidationArguments) {
    const object = args.object as any;
    if (object.username && object.email) {
      return 'Provide either username or email, not both';
    }
    return 'Either username or email must be provided';
  }
}

export function IsUsernameOrEmailProvided(
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameOrEmailProvidedConstraint,
    });
  };
}

class LoginDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @IsUsernameOrEmailProvided()
  password: string;
}

export { LoginDto };
