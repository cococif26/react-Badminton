import React from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom"
import NotFound from "../Pages/NotFound";
import secureLocalStorage from "react-secure-storage";

const RequireAuth = ({role=''}) => {
    const token = secureLocalStorage.getItem('token');
    const isRole = secureLocalStorage.getItem('role');
    const location = useLocation()
    
    return (
        token && (role===isRole) 
        ? (role==='admin' || role==='user') ? <Outlet /> : <NotFound/>
        : <Navigate to="/" state={{ from: location }} replace />
    )
}
export default RequireAuth