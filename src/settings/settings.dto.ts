import { IsEnum } from 'class-validator';

enum Currency {
  PHP = 'PHP',
  USD = 'USD',
}

class SettingsDto {
  @IsEnum(Currency)
  currency: Currency;
}

export { SettingsDto, Currency };
