declare enum Currency {
    PHP = "PHP",
    USD = "USD"
}
declare class SettingsDto {
    currency: Currency;
}
export { SettingsDto, Currency };
