import React from "react";
import { Bell, ChevronDown } from "lucide-react";

// 1. Add color props to the interface
interface HeaderProps {
  title: string;
  dateColor?: string; 
  bellColor?: string; 
}

const getFormattedDate = (): string => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();

  const getOrdinalSuffix = (d: number) => {
    if (d > 3 && d < 21) return "th";
    switch (d % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
};

const Header: React.FC<HeaderProps> = ({ 
  title, 
  dateColor = "text-white", // Default to white
  bellColor = "text-white"  // Default to white
}) => {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 px-6 md:pt-8 md:pr-12 md:pl-8 gap-4 sm:gap-0">
      <div>
        <h1 className="text-lg md:text-[20px] tracking-wider font-semibold leading-tight text-white uppercase">
          {title}
        </h1>
        {/* 2. Apply the dynamic date color here */}
        <p className={`text-xs md:text-sm mt-1 ${dateColor}`}>
          {getFormattedDate()}
        </p>
      </div>

      <div className="flex items-center gap-4 md:gap-6 self-end sm:self-auto">
        {/* Language Selector Button */}
        <button className="bg-[#0B0F14]/50 border border-gray-500/25 text-white pl-2 pr-4 py-1.5 rounded-full flex items-center gap-2 hover:bg-gray-800 transition-colors">
          <div className="w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden border border-gray-500 flex-shrink-0 bg-gray-100">
            <img
              src="https://flagcdn.com/w40/us.png"
              alt="US Flag"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-semibold">Eng(US)</span>
          <ChevronDown size={14} className="md:w-4 md:h-4 text-gray-400" />
        </button>

        {/* 3. Apply the dynamic bell color here */}
        <div className={`relative cursor-pointer ${bellColor}`}>
          <Bell size={24} className="md:w-7 md:h-7" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-[#9C0D0D] rounded-full border-2 border-[#04070C]" />
        </div>

        {/* Profile */}
        {/* <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-700 rounded-full overflow-hidden cursor-pointer">
          <img
            src="/api/placeholder/50/50"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div> */}
      </div>
    </header>
  );
};

export default Header;