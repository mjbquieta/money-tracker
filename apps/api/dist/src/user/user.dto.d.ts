import { SettingsDto } from 'src/settings/settings.dto';
declare class BaseUserDto {
    email: string;
    name: string;
    username: string;
    password: string;
}
declare class CreateUserWithSettingsDto extends BaseUserDto {
    settings: SettingsDto;
}
declare const UserPartialDto_base: import("@nestjs/mapped-types").MappedType<Partial<BaseUserDto>>;
declare class UserPartialDto extends UserPartialDto_base {
}
export { CreateUserWithSettingsDto, BaseUserDto, UserPartialDto };
