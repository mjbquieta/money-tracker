declare enum Currency {
    PHP = "PHP",
    USD = "USD",
    EUR = "EUR",
    GBP = "GBP",
    JPY = "JPY",
    AUD = "AUD",
    CAD = "CAD",
    SGD = "SGD"
}
declare class SettingsDto {
    currency: Currency;
}
declare class UpdateSettingsDto {
    currency?: Currency;
}
export { SettingsDto, UpdateSettingsDto, Currency };
