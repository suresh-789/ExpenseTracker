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
          {/* Sidebar (hidden on mobile - shown via Navbar) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
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
