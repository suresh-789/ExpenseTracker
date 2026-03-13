import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = useState(false);

  return (
    <div className="flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      {/* Mobile Menu Button */}
      <button
        className="block lg:hidden text-black"
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <h2 className="text-lg font-medium text-black">Expense Tracker</h2>

      {/* Mobile Sidebar Overlay */}
      {openSideMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setOpenSideMenu(false)}
          />
          {/* Side Menu */}
          <div className="fixed lg:hidden left-0 top-[61px] z-40">
            <SideMenu 
              activeMenu={activeMenu} 
              onClose={() => setOpenSideMenu(false)} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
