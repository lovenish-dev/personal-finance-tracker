import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CategorySummary, DashboardState, DashboardSummary, MonthlySummary } from "../../types/dashboard.types";


const initialState: DashboardState = {
    summary: null,
    categorySummary: [],
    monthlySummary:[],
    loading: false,
    error: null
}

const dashboardSlice = createSlice({
    name:"dashboard",
    initialState,
    reducers:{
        setDashboardSummary: (state, action: PayloadAction<DashboardSummary>) =>{
            state.summary = action.payload
        },
        setCategorySummary: (state, action: PayloadAction<CategorySummary[]>)=>{
            state.categorySummary = action.payload
        },
        setMonthlySummary: (state, action: PayloadAction<MonthlySummary[]>) =>{
            state.monthlySummary = action.payload
        },
        setLoading:(state, action: PayloadAction<boolean>)=>{
            state.loading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>)=>{
            state.error = action.payload
        }
    }
})

export const { setCategorySummary,setMonthlySummary, setDashboardSummary, setError, setLoading } = dashboardSlice.actions
export default dashboardSlice.reducer