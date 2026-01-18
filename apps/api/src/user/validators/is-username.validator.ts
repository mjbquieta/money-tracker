import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUsernameExistConstraint implements ValidatorConstraintInterface {
  constructor(protected readonly prisma: PrismaService) {}

  validate(username: string, args: ValidationArguments) {
    return this.prisma.user
      .findUnique({
        where: {
          username,
          deletedAt: null,
        },
      })
      .then((user) => !user);
  }
}

export function IsUsernameExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameExistConstraint,
    });
  };
}
