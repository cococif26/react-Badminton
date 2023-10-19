import React, { useEffect } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import { namaApp } from "./Services/config";
import PermissionDenied from "../Pages/PermissionDenied";
import Sidebar from "./Sidebar";
import secureLocalStorage from "react-secure-storage";

const Layout = () => {
  const token = secureLocalStorage.getItem("token");
  const isRole = secureLocalStorage.getItem("role");

  let curLoc = useLocation();
  useEffect(() => {
    const titleMap = [
      { path: "/login", title: "Login" },
      { path: "/dashboard", title: "Dashboard" },
      { path: "/create-booking", title: "Create Booking" },
      { path: "/schedule", title: "Schedule" },
      { path: "/history-booking", title: "History Booking" },
      { path: "/data-master", title: "Data Master" },
      { path: "/user-management", title: "User Management" },
      { path: "/setting", title: "Setting" },
    ];
    const curTitle = titleMap.find((item) => item.path === curLoc.pathname);
    if (curTitle && curTitle.title) {
      document.title = curTitle.title + " - " + namaApp;
    } else {
      document.title = namaApp;
    }
  }, [curLoc]);

  return (
    <>
      {token ? (
        <>
          {curLoc.pathname === "/login" ? (
            <Navigate to="/dashboard" state={{ from: curLoc }} replace />
          ) : isRole === "admin" ? (
            <div className="d-flex" id="wrapper">
              <Sidebar />
        
              <div id="page-content-wrapper">
              <div className="navbar-utama">
                  <Navbar />
                </div>
                <div className="container-fluid">
                  <Outlet />{" "}
                </div>
                <footer>
                  <p className="copyright"> &copy; Copyright 2023 PKL Cibione. All Rights Reserved</p>
                </footer>
              </div>
              
            </div>
          ) : isRole === "user" ? (
            <Outlet />
          ) : (
            <PermissionDenied />
          )}
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};
export default Layout;
