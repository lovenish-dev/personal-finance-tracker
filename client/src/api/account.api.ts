import api from "./axios";

export async function createAccount(data: { name: string, balance: number }){
    const response = await api.post("/account", data);
    return response.data
}

export async function getAccounts(){
    const response = await api.get("/account");
    return response.data
}