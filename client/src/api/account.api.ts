import type { AccountType } from "../types/account.types";
import api from "./axios";

export async function createAccount(data: { name: string, type: AccountType , balance: number }){
    const response = await api.post("/account", data);
    return response.data;
}

export async function getAccounts(){
    const response = await api.get("/account");
    return response.data;
}

export async function getAccountsById(id: number){
    const response = await api.get(`/account/${id}`);
    return response.data;
}

export async function updateAccount(id: number, data: {name?: string, type?: AccountType}){
    const response = await api.patch(`/account/${id}`, data);
    return response.data;
}

export async function deleteAccount(id: number){
    const response = await api.delete(`/account/${id}`);
    return response.data
}