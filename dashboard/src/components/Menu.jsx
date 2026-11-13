import React from "react";
import { useState } from "react";
import {Link} from "react-router-dom";
import UserPopUp from "./userPopUp";

const Menu = () => {
  const [selectedMenu , setSelectedMenu ] = useState(0);
  const [isProfileDropdownOpen , setisProfileDropdownOpen] =useState(false);

  const handleMenuClick = (index) =>{
    setSelectedMenu(index);
  };

  const handleProfileClick = (index) =>{
    setisProfileDropdownOpen(!isProfileDropdownOpen);
  };

const menuClass = "menu";
const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="/logo.png" style={{ width: "50px" }} alt="error" />
      <div className="menus">
        <ul className="hov">
          <li>
            <Link 
            style={{textDecoration: "none"}}
            to="/console"
            onClick={()=> handleMenuClick(0)}
            >
            <p className={selectedMenu===0 ? activeMenuClass : menuClass}>Dashboard</p>
            </Link>
          </li>
          <li>
             <Link 
            style={{textDecoration: "none"}}
            to="/console/orders"
            onClick={()=> handleMenuClick(1)}
            >
            <p className={selectedMenu===1 ? activeMenuClass : menuClass}>Order</p>
            </Link>
          </li>
          <li>
            <Link 
            style={{textDecoration: "none"}}
            to="/console/holdings"
            onClick={()=> handleMenuClick(2)}
            >
            <p className={selectedMenu===2 ? activeMenuClass : menuClass}>Holdings</p>
            </Link>
          </li>
          <li>
            <Link 
            style={{textDecoration: "none"}}
            to="/console/positions"
            onClick={()=> handleMenuClick(3)}
            >
            <p className={selectedMenu===3 ? activeMenuClass : menuClass}>Positions</p>
            </Link>
          </li>
          
          
        </ul>
        <hr />
        <div className="profile" onClick={handleProfileClick} >
          <div className="avatar">ZU</div>
          <p className="username">USERID</p>
        </div>
        {isProfileDropdownOpen && <UserPopUp/>}
        
      </div>
    </div>
  );
};

export default Menu;
