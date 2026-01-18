import { IsEnum, IsOptional } from 'class-validator';

enum Currency {
  PHP = 'PHP',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  AUD = 'AUD',
  CAD = 'CAD',
  SGD = 'SGD',
}

class SettingsDto {
  @IsEnum(Currency)
  currency: Currency;
}

class UpdateSettingsDto {
  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;
}

export { SettingsDto, UpdateSettingsDto, Currency };
