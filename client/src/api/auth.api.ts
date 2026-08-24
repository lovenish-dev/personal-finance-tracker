import api from "./axios";
import type { RegisterBody, LoginBody, AuthResponse } from "../types/auth.types";

export async function registerUser(data: RegisterBody){
    const response = await api.post("/auth/register", data);
    return response.data
}

export async function loginUser(data: LoginBody): Promise<AuthResponse>{
    const response = await api.post("/auth/login", data);
    return response.data
}