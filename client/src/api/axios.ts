import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers : {
        "Content-Type": "application/json",
    }
})

api.interceptors.request.use((config)=>{
    const storedAuth = localStorage.getItem("auth");

    if(storedAuth){
        const { token } = JSON.parse(storedAuth);
        if(token) config.headers.Authorization = `Bearer ${token}`;
    }

    return config
})

export default api;