import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";
import { setToggle } from "../Reducers/menuSlice";
import "./style.css";
import secureLocalStorage from "react-secure-storage";


const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const dirIcon = "/assets/icon/";
  const roleMenus = JSON.parse(secureLocalStorage.getItem("menus").replace(/'/g, '"'));
  let subMaster = [
    { name: "Court", link: "/data-master/court" },
    { name: "Customer Regular", link: "/data-master/regular" },
    { name: "Customer Member", link: "/data-master/member" },
    { name: "Holidays", link: "/data-master/calendar" },
    { name: "Peak Time", link: "/data-master/peaktime" },
  ];
  let subUser = [
    { name: "User List", link: "/user-management/user-list" },
    { name: "User Role", link: "/user-management/user-role" },
  ];
  let Links = [
    { name: "Dashboard", link: "/dashboard", icon: "dashboard2" },
    { name: "Schedule", link: "/schedule", icon: "schedule3" },
    // {name:"Qr Code", link:"/scanner", icon:"code qr"},
    { name: "Verification Booking", link: "/verification", icon: "verifikasi2" },
    { name: "History Booking", link: "/history-booking", icon: "history3" },
    { name: "Data Master", link: "/", icon: "master2", sub: subMaster },
    { name: "User Management", link: "/", icon: "user3", sub: subUser },
    // {name:"Profile", link:"/profile", icon:"adminprofile"},
    { name: "Setting", link: "/setting", icon: "setting2" },
  ];
  const [menuOpen, setMenuOpen] = useState(true);
  const [menuSubOpen, setMenuSubOpen] = useState(0);
  const [menuSubSel, setMenuSubSel] = useState(0);
  const toggle = () => setMenuOpen(!menuOpen);

//   const handleToggle = () => {
//     toggle();
//     document.body.classList.toggle("sb-sidenav-toggled");
//   };

  const handleToggle2 = (val, val2 = "") => {
    if (menuSubSel === val && menuSubOpen === val) {
      setMenuSubOpen(0);
    } else {
      if ((menuOpen && !menuSubOpen && val2 === "") || (!menuOpen && val2 === "") || val2 === "close") {
        setMenuSubOpen(val);
      }
    }
    setMenuSubSel(val);
    if (val === 0) {
      if (window.innerWidth <= 768) {
        dispatch(setToggle({ menuSidebar: false }));
        document.body.classList.toggle("sb-sidenav-toggled");
      }
    }
  };

  let filteredLinks;
  if (roleMenus.includes("super-admin") || roleMenus.includes("/super-admin")) {
    filteredLinks = Links;
  } else {
    filteredLinks = Links.filter((val, key) => {
      if (val.sub) {
        const filteredSubmenu = val.sub.filter((val2, key2) => {
          return roleMenus.includes(val2.link);
        });

        val.sub = filteredSubmenu;
        return filteredSubmenu.length > 0;
      } else {
        return roleMenus.includes(val.link);
      }
    });
  }

  return (
    <div className="border-end text-dark" id="sidebar-wrapper">
      <div className="profile_info">
        <img src="./brand.png" className="profile_image" alt="" style={{ width: "45px", marginLeft: "25px" }} />
        <b style={{ marginLeft: "9px", marginTop: "25px" }}>Shuttlebook.</b>
      </div><hr/>
      
      <div className="list-group list-group-flush list_menu_sidebar">
        {filteredLinks.map((val, key) => ({
          ...(val.sub ? (
            <div key={`submenu${key}`} title={val.name} className={`list-group-item list-group-item-action list-group-item-light dropdown_menu ${menuSubOpen === key ? "active" : ""}`}>
              <img src={`${dirIcon}${val.icon}.png`} alt="" onClick={() => handleToggle2(key, "close")} />
              <span onClick={() => handleToggle2(key, "close")}>{val.name}</span>
              <div className="subMenu" onClick={() => handleToggle2(key, "close")}>
                {menuSubOpen === key ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </div>
              <div className={`dropdown_menu_item ${menuSubOpen === key ? "active" : ""}`}>
                {val.sub.map((val2, key2) => (
                  <NavLink key={`sub${key2}`} title={val2.name} to={val2.link} onClick={() => handleToggle2(0)} className={`list-group-item list-group-item-action list-group-item-light ${location.pathname === val2.link ? "active" : ""}`}>
                    <span>{val2.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
            <NavLink
              key={`singlemenu${key}`}
              to={val.link}
              onClick={() => handleToggle2(0, "close")}
              data-title={val.name}
              className={`list-group-item list-group-item-action list-group-item-light single_menu ${location.pathname === val.link || (val.link === "/dashboard" && location.pathname === "/") ? "active" : ""}`}
            >
              <img src={`${dirIcon}${val.icon}.png`} alt="" />
              <span>{val.name}</span>
            </NavLink>
          )),
        }))}
      </div>
    </div>
  );
};

export default Sidebar;
