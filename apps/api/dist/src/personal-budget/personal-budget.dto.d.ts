declare class PersonalBudgetItemDto {
    name: string;
    description?: string;
    amount: number;
}
declare class CreatePersonalBudgetDto {
    name: string;
    description?: string;
    items?: PersonalBudgetItemDto[];
}
declare class UpdatePersonalBudgetDto {
    name?: string;
    description?: string;
}
declare class CreatePersonalBudgetItemDto {
    name: string;
    description?: string;
    amount: number;
}
declare class UpdatePersonalBudgetItemDto {
    name?: string;
    description?: string;
    amount?: number;
}
export { PersonalBudgetItemDto, CreatePersonalBudgetDto, UpdatePersonalBudgetDto, CreatePersonalBudgetItemDto, UpdatePersonalBudgetItemDto, };
