import React from "react";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom"; // <-- Changed from useNavigate to Link

import homeIcon from "../assets/home.png";
import qaIcon from "../assets/qa.png";
import aboutIcon from "../assets/about.png";
import overviewIcon from "../assets/overview.png";

interface SidebarProps {
  activePage: "home" | "messages" | "info" | "overview";
}

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  const navItems = [
    { id: "home", path: "/", icon: homeIcon },
    { id: "messages", path: "/messages", icon: qaIcon },
    { id: "info", path: "/info", icon: aboutIcon },
    { id: "overview", path: "/overview", icon: overviewIcon },
  ];

  return (
    <aside className="fixed bottom-0 left-0 z-50 w-full h-[70px] md:relative md:w-[100px] md:h-full flex flex-row md:flex-col justify-around md:justify-between items-center bg-[#0B0F14] border-t md:border-t-0 md:border-r border-gray-500/25 py-0 md:py-8">
      {/* Logo */}
      <div className="hidden md:block text-[70px] force-nico-font leading-none text-center mb-8 text-[#CEE0CE]">
        P
      </div>

      {/* Navigation */}
      <nav className="flex flex-row md:flex-col gap-4 md:gap-10 w-full flex-1 justify-around md:justify-center items-center md:mt-12">
        {navItems.map((item) => {
          const isActive = item.id === activePage;
          return (
            /* We swapped the <div> for a <Link> to make routing foolproof */
            <Link
              key={item.id}
              to={item.path}
              className="relative w-auto md:w-full flex justify-center items-center p-2 md:p-4 cursor-pointer hover:bg-white/5 transition-colors"
            >
              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute -bottom-2 md:bottom-auto md:left-0 md:top-1/2 md:-translate-y-1/2 w-8 h-[4px] md:w-[6px] md:h-[34px] bg-white rounded-t-md md:rounded-r-md md:rounded-t-none" />
              )}
              
              <img
                src={item.icon}
                alt={`${item.id} icon`}
                className={`w-6 h-6 md:w-8 md:h-8 object-contain transition-opacity ${
                  isActive ? "opacity-100" : "opacity-60"
                }`}
              />
            </Link>
          );
        })}
      </nav>

      <LogOut
        size={28}
        className="hidden md:block opacity-60 hover:opacity-100 cursor-pointer transition-opacity mb-4 text-white"
      />
    </aside>
  );
};

export default Sidebar;