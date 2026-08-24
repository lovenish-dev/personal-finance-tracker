import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/auth.types";

type AuthState = {
  user: User | null
  token: string | null;
  isAuthenticated: boolean;
};

const storedAuth = localStorage.getItem("auth");

const initialState: AuthState = storedAuth ? JSON.parse(storedAuth) : {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User, token: string }>) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;

        localStorage.setItem("auth", JSON.stringify(state))
    },

    logout: (state) =>{
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;

        localStorage.removeItem("auth")
    }
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;