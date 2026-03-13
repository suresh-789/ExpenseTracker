import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

const DashboardLayout = ({ children, activeMenu }) => {
  const { user } = useContext(UserContext);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar activeMenu={activeMenu} />

      {/* Sidebar + Content */}
      {user && (
        <div className="flex">
          {/* Sidebar (hidden on mobile) */}
          <div className="hidden lg:block">
            <SideMenu activeMenu={activeMenu} />
          </div>

          {/* Page Content */}
          <div className="flex-grow p-6">{children}</div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
