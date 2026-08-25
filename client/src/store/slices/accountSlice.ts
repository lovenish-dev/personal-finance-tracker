import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { AccountState, Account } from "../../types/account.types"

const initialState: AccountState = {
   accounts: [],
   loading: false,
   error: null  
}

const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setAccount: (state, action: PayloadAction<Account[]>)=>{
            state.accounts = action.payload;
        },

        addAccount:(state, action: PayloadAction<Account>)=>{
            state.accounts.push(action.payload)
        },

        updateAccount:(state, action: PayloadAction<Account>) =>{
            const index = state.accounts.findIndex((account) => account.id === action.payload.id);
            if(index !== -1) state.accounts[index] = action.payload
        },

        removeAccount:(state, action: PayloadAction<number>)=>{
            state.accounts = state.accounts.filter((account) => account.id !== action.payload);
        },

        setLoading: (state, action: PayloadAction<boolean>)=>{
            state.loading = action.payload
        },

        setError: (state, action: PayloadAction<string | null>) =>{
            state.error = action.payload
        }
    }
})

export const { setAccount, addAccount, updateAccount, removeAccount, setLoading, setError } = accountSlice.actions
export default accountSlice.reducer;