export type CategoryType = "income" | "expense";

export interface CreateCategoryBody {
    name: string,
    type: CategoryType
}

export interface UpdateCategoryBody {
    name? : string,
    type? : CategoryType
}