import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout: React.FC = () => {
  return (
    // 1. The main wrapper is fixed to the exact height of the screen (h-screen)
    // 2. overflow-hidden prevents the whole browser window from scrolling
    <div className="flex h-screen w-full bg-[#04070C] overflow-hidden">
      
      {/* 3. The Sidebar sits on the left. It will never scroll. */}
      <Sidebar />

      {/* 4. The main content area takes up the remaining space (flex-1) */}
      {/* 5. overflow-y-auto allows ONLY this right side to scroll if content gets long */}
      <div className="flex-1 h-full overflow-y-auto relative">
        {/* <Outlet /> is where React Router inserts your specific pages */}
        <Outlet />
      </div>

    </div>
  );
};

export default Layout;