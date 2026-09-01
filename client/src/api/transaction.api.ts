import type { CreateTransaction, TransactionFilters } from "../types/transaction.types";
import api from "./axios";

export async function getTransactions(filters?: TransactionFilters){
    const response = await api.get("/transaction",{
        params: filters
    });
    return response.data    
}

export async function createTransaction(data: CreateTransaction){
    const response = await api.post("/transaction", data);
    return response.data
}

export async function deleteTrasaction(id: number){
    const response = await api.delete(`/transaction/${id}`);
    return response.data
}

export async function updateTransaction(id: number, data: Partial<CreateTransaction>){
    const response = await api.patch(`/transaction/${id}`, data);
    return response.data
}