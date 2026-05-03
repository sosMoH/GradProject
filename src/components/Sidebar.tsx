import React from "react";
// import { LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion"; 

import homeIcon from "../assets/home.png";
import qaIcon from "../assets/qa.png";
import overviewIcon from "../assets/overview.png";

// REMOVED SidebarProps - It is no longer needed!

const Sidebar: React.FC = () => {
  const location = useLocation(); 

  const navItems = [
    { id: "home", path: "/", icon: homeIcon },
    { id: "messages", path: "/FAQs", icon: qaIcon },
    { id: "overview", path: "/overview", icon: overviewIcon },
  ];

  return (
    // Restored the fixed bottom-0 classes for mobile phones
    <aside className="fixed bottom-0 left-0 z-50 w-full h-[70px] md:relative md:w-[100px] md:h-full flex flex-row md:flex-col justify-around md:justify-between items-center bg-[#0B0F14] border-t md:border-t-0 md:border-r border-gray-500/25 py-0 md:py-8 flex-shrink-0">
      
      {/* Logo - Hidden on mobile */}
      <div className="hidden md:block text-[70px] force-nico-font leading-none text-center mb-8 text-[#CEE0CE]">
        M
      </div>

      {/* Navigation - Row on mobile, Column on desktop */}
      <nav className="flex flex-row md:flex-col gap-4 md:gap-10 w-full flex-1 justify-around md:justify-center items-center md:mt-12 relative">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className="relative w-auto md:w-full flex justify-center items-center p-2 md:p-4 cursor-pointer transition-colors"
            >
              {/* Framer Motion Animated Indicator (Handles both mobile top-bar and desktop left-bar) */}
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute top-0 md:top-1/2 left-1/2 md:left-0 -translate-x-1/2 md:-translate-x-0 md:-translate-y-1/2 w-22 h-[4px] md:w-[3px] md:h-[60px] bg-white rounded-b-md md:rounded-bl-none md:rounded-r-md"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <img
                src={item.icon}
                alt={`${item.id} icon`}
                className={`w-6 h-6 md:w-13 md:h-13 object-contain transition-opacity ${
                  isActive ? "opacity-100" : "opacity-60"
                }`}
              />
            </Link>
          );
        })}
      </nav>

      {/* Logout - Hidden on mobile to save space */}
      {/* <LogOut
        size={28}
        className="hidden md:block opacity-60 hover:opacity-100 cursor-pointer transition-opacity mb-4 text-white"
      /> */}
    </aside>
  );
};

export default Sidebar;