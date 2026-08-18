import { AppError } from "../../utils/Apperror.js";
import { fetchCategoriesByuserId, fetchCategoryById, insertCategory, modifyCategory, removeCategory } from "./category.repository.js";
import type { CreateCategoryBody, UpdateCategoryBody } from "./category.types.js";

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

export async function updateCategoryService(id: number, userId: number, data: UpdateCategoryBody){
    const existingCategory = await fetchCategoryById(userId, id);
    if(!existingCategory) throw new AppError("Category not found", 404);
    if(Object.keys(data).length === 0) throw new AppError("At least one field is required", 404)
    const result = await modifyCategory(id, userId, data);
    return result
}

export async function deleteCategoryService(id: number, userId: number){
    const existingCategory = await fetchCategoryById(userId, id);
    if(!existingCategory) throw new AppError("Category not found", 404);
    const result = await removeCategory(id, userId);
    return result
}