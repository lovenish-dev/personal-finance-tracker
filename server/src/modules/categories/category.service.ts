import { AppError } from "../../utils/Apperror.js";
import { fetchCategoriesByuserId, fetchCategoryById, insertCategory } from "./category.repository.js";
import type { CreateCategoryBody } from "./category.types.js";

export async function createCategoryService(userId: number, data: CreateCategoryBody ){
    const result = await insertCategory(userId, data);
    return result;
}

export async function getCategoriesByUserIdService(userId: number){
     const result = await fetchCategoriesByuserId(userId);
     return result;
}

export async function getCategoryByIdService(userId: number, id:number){
    const result = await fetchCategoryById(userId, id);
    if(!result) throw new AppError("Category not found", 404)
    return result;
}