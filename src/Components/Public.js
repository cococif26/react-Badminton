import React from "react";
import Dashboard from "../Pages/Users/Dashboard/dashboard";
import LandingPage from "../Pages/LandingPages/landingPage";
import Landing2 from "../Pages/LandingPages/Landing2";
import PermissionDenied from "../Pages/PermissionDenied";
import secureLocalStorage from "react-secure-storage"

const Public = () => {
  const token = secureLocalStorage.getItem("token");
  const isRole = secureLocalStorage.getItem("role");
  return token ? isRole === "admin" ? <Dashboard /> : isRole === "user" ? <Landing2 /> : <PermissionDenied /> : <LandingPage />;
};
export default Public;
