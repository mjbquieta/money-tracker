declare enum DefaultCategory {
    BILLS = "BILLS",
    FOOD = "FOOD",
    TRANSPORT = "TRANSPORT",
    SAVINGS = "SAVINGS",
    ENTERTAINMENT = "ENTERTAINMENT"
}
declare class CreateCategoryDto {
    name: string;
    description?: string;
}
declare class UpdateCategoryDto {
    name?: string;
    description?: string;
}
export { CreateCategoryDto, UpdateCategoryDto, DefaultCategory };
