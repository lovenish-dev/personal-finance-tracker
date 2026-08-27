export type CategoryType = "income" | "expense"

export type CreateCategoryBody = {
    name: string;
    type: CategoryType;
}
export type Category = {
    id: number,
    user_id: number,
    name: string,
    type: CategoryType,
    created_at: string,
    updated_at: string
}

export type CategoryState = {
    categories:Category[];
    loading: boolean;
    error: string | null;
}

