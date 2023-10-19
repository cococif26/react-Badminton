// import React from "react";
// import { Navigate, useLocation } from "react-router-dom"
import secureLocalStorage from "react-secure-storage";
import axios from "../../api/axios";


const Logout = async () => {
    // const location = useLocation();
    // localStorage.clear()
    await axios.get('/sanctum/csrf-cookie')
    await axios.post('/api/logout-admin', null, {
        headers: {
            Authorization: `Bearer ${secureLocalStorage.getItem('token')}`
        }
    })
    secureLocalStorage.removeItem('token');
    secureLocalStorage.removeItem('role')
    // return (<Navigate to="/" state={{ from: location }} replace />)
    setTimeout(function () { window.location.href = "/"; }, 500);
};

export default Logout;