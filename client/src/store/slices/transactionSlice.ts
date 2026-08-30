import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TransactionState, Transaction } from "../../types/transaction.types";


const initialState:TransactionState = {
      transcations: [],
      loading: false,
      error: null
}

const transactionSlice = createSlice({
      name: "transactions",
      initialState,
      reducers: {
        setTransactions: (state, action: PayloadAction<Transaction[]>) =>{
            state.transcations = action.payload
        },
        addTransactions: (state, action:PayloadAction<Transaction>) =>{
            state.transcations.push(action.payload)
        },
        removeTransaction:(state, action:PayloadAction<number>)=>{
            state.transcations = state.transcations.filter(transaction => action.payload !== transaction.id )
        },
        modifyTransaction: (state, action:PayloadAction<Transaction>)=>{
            const index = state.transcations.findIndex(transaction => transaction.id === action.payload.id);
            if(index !== -1) state.transcations[index] = action.payload
        },
        setLoading: (state, action: PayloadAction<boolean>)=>{
            state.loading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>)=>{
            state.error = action.payload
        }
      }
})

export const { setTransactions,setError,modifyTransaction, setLoading, addTransactions, removeTransaction } = transactionSlice.actions
export default transactionSlice.reducer