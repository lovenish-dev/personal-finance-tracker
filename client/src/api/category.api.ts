import type { CreateCategoryBody } from "../types/category.types";
import api from "./axios"

export async function getCategories(){
   const response = await api.get("/categories/");
   return response.data;
}

export async function createCategory(data: CreateCategoryBody){
    const response = await api.post("/categories/", data);
    return response.data
} 

export async function deleteCategory(id: number){
    const response = await api.delete(`/categories/${id}`);
    return response.data
}

export async function updateCategory(id: number, data: Partial<CreateCategoryBody>){
    const response = await api.patch(`/categories/${id}`, data);
    return response.data
}