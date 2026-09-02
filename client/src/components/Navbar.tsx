import { Link } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import { useAppDispatch } from "../hooks/redux";

export default function Navbar() {
    const dispatch = useAppDispatch();

    function handleLogout() {
        dispatch(logout());
    }
    return (
        <nav>
            <Link to="/dashboard">
                Finance Manager
            </Link>

            <div>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/accounts">Accounts</Link>
                <Link to="/transactions">Transactions</Link>
                <Link to="/categories">Categories</Link>
            </div>

            <button onClick={handleLogout}>
                Logout
            </button>
        </nav>
    )
}
