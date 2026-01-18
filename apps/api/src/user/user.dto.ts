import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { IsEmailExist } from './validators/is-email.validator';
import { IsUsernameExist } from './validators/is-username.validator';
import { SettingsDto } from 'src/settings/settings.dto';

class BaseUserDto {
  @IsEmail()
  @IsEmailExist({ message: 'Email is taken' })
  email: string;

  @IsString()
  @MaxLength(40)
  name: string;

  @IsString()
  @IsUsernameExist({ message: 'Username is taken' })
  username: string;

  @IsStrongPassword({
    minLength: 4,
    minNumbers: 1,
    minSymbols: 1,
    minLowercase: 1,
    minUppercase: 1,
  })
  password: string;
}

class CreateUserWithSettingsDto extends BaseUserDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => SettingsDto)
  settings: SettingsDto;
}

class UserPartialDto extends PartialType(BaseUserDto) {}

export { CreateUserWithSettingsDto, BaseUserDto, UserPartialDto };
