import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CategoryState, Category } from "../../types/category.types";

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    addCategories: (state, action: PayloadAction<Category>) =>{
      state.categories.push(action.payload)
    },
    removeCategory:(state, action: PayloadAction<number>) =>{
       state.categories = state.categories.filter((category) => category.id !== action.payload)
    },
    modifyCategory:(state, action:PayloadAction<Category>)=>{
       const index = state.categories.findIndex(category => category.id === action.payload.id);
       if(index !== -1) state.categories[index] = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setCategories, setLoading, setError, addCategories, modifyCategory, removeCategory } = categorySlice.actions;
export default categorySlice.reducer;
