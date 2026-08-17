export type CategoryType = "income" | "expense";

export interface CreateCategoryBody {
    name: string,
    type: CategoryType
}