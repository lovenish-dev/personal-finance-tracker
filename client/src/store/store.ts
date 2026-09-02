import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"
import accountReducer from "./slices/accountSlice"
import categoryReducer from "./slices/categorySlice";
import transactionReducer from "./slices/transactionSlice";
import dashboardReducer from "./slices/dashboardSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        account: accountReducer,
        category: categoryReducer,
        transaction: transactionReducer,
        dashboard: dashboardReducer
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch