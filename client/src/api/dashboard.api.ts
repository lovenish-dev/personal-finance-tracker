import api from "./axios";

export async function getDashboardSummary(){
    const response = await api.get("/dashboard/");
    return response.data
}

export async function getCategorySummary(){
    const response = await api.get("/dashboard/category");
    return response.data
}

export async function getMonthlySummary(){
    const response = await api.get("/dashboard/monthly");
    return response.data
}