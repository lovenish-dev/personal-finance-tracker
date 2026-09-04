import { Link, NavLink } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { useAppDispatch } from "../hooks/redux";
import { useState } from "react";
import ButtonLoader from "./ButtonLoader";

export default function Navbar() {
    const dispatch = useAppDispatch();
    const [logoutLoading, setLogoutLoading] = useState<boolean>(false)

    function handleLogout() {
        setLogoutLoading(true)
        dispatch(logout());
        setLogoutLoading(false)
    }

    const navLinkClass = ({ isActive } : {isActive: boolean})=> `text-sm font-medium transition ${isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`

    return (
        <nav className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link
                    to="/dashboard"
                    className="text-xl font-bold text-gray-900"
                >
                    Finance Manager
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                    <NavLink to="/dashboard" className={navLinkClass}>
                        Dashboard
                    </NavLink>

                    <NavLink to="/accounts" className={navLinkClass}>
                        Accounts
                    </NavLink>

                    <NavLink to="/transactions" className={navLinkClass}>
                        Transactions
                    </NavLink>

                    <NavLink to="/categories" className={navLinkClass}>
                        Categories
                    </NavLink>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className='rounded-md flex justify-center bg-red-500 disabled:bg-red-400 cursor-pointer px-4 py-2 text-sm font-medium text-white hover:bg-red-600'
                >
                    { logoutLoading ? <ButtonLoader /> : "Logout" }
                </button>
            </div>
        </nav>
    );
}