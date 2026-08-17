import { fetchCategoriesByuserId, insertCategory } from "./category.repository.js";
import type { CreateCategoryBody } from "./category.types.js";

export async function createCategoryService(userId: number, data: CreateCategoryBody ){
    const result = await insertCategory(userId, data);
    return result;
}

export async function getCategoriesByUserIdService(userId: number){
     const result = await fetchCategoriesByuserId(userId);
     return result;
}