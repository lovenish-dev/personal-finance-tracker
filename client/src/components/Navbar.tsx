import { Link } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { useAppDispatch } from "../hooks/redux";

export default function Navbar() {
    const dispatch = useAppDispatch();

    function handleLogout() {
        dispatch(logout());
    }

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
                    <Link
                        to="/dashboard"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/accounts"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        Accounts
                    </Link>

                    <Link
                        to="/transactions"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        Transactions
                    </Link>

                    <Link
                        to="/categories"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900"
                    >
                        Categories
                    </Link>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}