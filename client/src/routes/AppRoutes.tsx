import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login"
import ProtectedRoutes from "./ProtectedRoutes";
import Account from "../pages/dashboard/Account";
import Category from "../pages/dashboard/Category";
import Transaction from "../pages/dashboard/Transaction";
import Dashboard from "../pages/dashboard/Dashboard";
import AppLayout from "../layouts/AppLayout";
import Register from "../pages/auth/register";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoutes />}>
        <Route element={<AppLayout />} >
          <Route path="/accounts" element={<Account />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/transactions" element={<Transaction />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  )
}
