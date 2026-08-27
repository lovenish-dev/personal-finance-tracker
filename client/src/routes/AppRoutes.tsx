import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/login"
import ProtectedRoutes from "./ProtectedRoutes";
import Account from "../pages/dashboard/Account";
import Category from "../pages/dashboard/Category";

export default function AppRoutes() {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/accounts" element={<Account />} />
          <Route path="/categories" element={<Category />} />
        </Route>
    </Routes>
  )
}
