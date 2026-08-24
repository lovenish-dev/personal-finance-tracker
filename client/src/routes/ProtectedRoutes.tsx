import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../hooks/redux'

export default function ProtectedRoutes() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
   
  if(!isAuthenticated){
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
