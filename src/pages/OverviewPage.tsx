import React from "react";
import Header from "../components/Header";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  HelpCircle,
} from "lucide-react";

import { getFormattedDate } from "../components/Header";

// --- IMPORT YOUR LOCAL IMAGES HERE ---
// Change these filenames to match exactly what you saved in your folder!
import imgRoom from "../assets/alarms_locations/bedroom.png"; 
import imgGarden from "../assets/alarms_locations/garden.png";
import imgRoof from "../assets/alarms_locations/roof.png";

// --- Custom Components for the Overview Page ---

// 1. DYNAMIC GAUGE CARD Component
const GaugeCard = ({
  title,
  value,
  unit,
  color,
  percentage,
  textColor,
}: any) => {
  const arcLength = 314.16; 
  const offset = arcLength - percentage * arcLength;
  const rotation = -120 + percentage * 240;

  return (
    <div className="bg-[#0B0F14]/60 border border-gray-500/25 rounded-[25px] p-6 flex flex-col items-center relative w-full max-w-[250px] aspect-square justify-between">
      {/* Title */}
      <h3 className="text-white text-2xl w-full text-left font-semibold">
        {title}
      </h3>

      {/* Dynamic Gauge Graphic */}
      <div className="relative w-full flex justify-center mt-2">
        <svg
          viewBox="0 0 200 160"
          className="w-[160px] h-[130px] overflow-visible"
        >
          {/* Grey Background Arc */}
          <path
            d="M 35 137.5 A 75 75 0 1 1 165 137.5"
            fill="none"
            stroke="#EAEAEA"
            strokeWidth="20"
            strokeLinecap="round"
          />

          {/* Dynamic Colored Arc */}
          <path
            d="M 35 137.5 A 75 75 0 1 1 165 137.5"
            fill="none"
            stroke={color}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />

          {/* Indicator Triangle */}
          <g transform={`rotate(${rotation}, 100, 100)`} className="transition-all duration-1000 ease-out">
            <polygon
              points="100,14 94,2 106,2"
              fill="#FFF"
            />
          </g>
        </svg>

        {/* Centered Value and Unit */}
        <div className="absolute top-[42%] flex flex-col items-center">
          <span
            className="text-[32px] font-semibold leading-none"
            style={{ color: textColor }}
          >
            {value}
          </span>
          <span className="text-gray-400 text-sm mt-1">{unit}</span>
        </div>
      </div>

      {/* Standard Question Mark Icon */}
      <HelpCircle size={18} className="text-gray-500 mt-2 cursor-pointer" />
    </div>
  );
};

// 2. Alarm Row Component
// FIX: Added 'image' to the destructured props
const AlarmRow = ({ time, type, value, isSolved, image }: any) => (
  <div className="flex items-center justify-between text-[16px] md:text-[18px] text-white/70 py-3 border-b border-gray-500/10 last:border-0">
    <div className="flex items-center gap-4">
      {/* FIX: Now uses the dynamic image prop instead of a placeholder link */}
      <img
        src={image}
        alt={`${type} location`}
        className="w-[70px] h-[40px] rounded-[10px] object-cover"
      />
      <span className="font-mono">{time}</span>
      <span className="font-bold text-white w-[60px]">{type}</span>
    </div>
    <div className="flex items-center gap-6">
      <span>{value}</span>
      {/* Simple styled checkbox outline */}
      <div
        className={`w-6 h-6 border ${isSolved ? "bg-[#3E9479] border-[#3E9479]" : "border-gray-500"} rounded-sm cursor-pointer`}
      ></div>
    </div>
  </div>
);

// --- MAIN Overview Page Component ---

const OverviewPage: React.FC = () => {
  // FIX: Added the specific imported images to each data object
  const dummyAlarms = [
    { id: 2, time: "2026-05-02 18:33", type: "CO2", value: "30µg/m³", image: imgRoom },
    { id: 1, time: "2026-05-02 18:33", type: "PM2.5", value: "40µg/m³", image: imgGarden },
    { id: 3, time: "2026-05-02 18:33", type: "PM2.5", value: "70µg/m³", image: imgRoof },
  ];

  return (
    <div className="relative w-full min-h-full bg-[#04070C] font-sans flex flex-col pb-[70px] md:pb-0 overflow-x-hidden">
      
      <main className="flex-1 flex flex-col w-full">
        <Header
          title="AIR QUALITY MONITORING AND CONTROL"
          dateColor="text-[#0A7C56]"
          bellColor="text-[#0A7C56]"
        />

        <div className="px-6 md:px-12 py-8 flex flex-col gap-10 max-w-[1440px] mx-auto w-full">
          <section>
            <h2 className="text-[32px] text-[#0A7C56] mb-6">Latest status</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center md:justify-items-start">
              <GaugeCard
                title="AQI"
                value="153"
                unit=""
                color="#FF8B16"
                textColor="#FF8B16"
                percentage={0.7}
              />
              <GaugeCard
                title="PM2.5"
                value="143"
                unit="µg/m³"
                color="#9C0D0D"
                textColor="#9C0D0D"
                percentage={0.8}
              />
              <GaugeCard
                title="CO₂"
                value="1500"
                unit="ppm"
                color="#FF8B16"
                textColor="#FF8D28"
                percentage={0.6}
              />
              <GaugeCard
                title="NO₂"
                value="100"
                unit="ppb"
                color="#FF8B16"
                textColor="#FF8D28"
                percentage={0.4}
              />
            </div>
          </section>

          <section>
            <h2 className="text-[32px] text-[#0A7C56] mb-6">History data</h2>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 text-white w-full">
              <div className="flex flex-wrap gap-0 bg-[#0B0F14]/60 border border-gray-500/25 rounded-[15px] overflow-hidden">
                <button className="px-6 py-3 border-r border-gray-500/25 flex items-center gap-4 hover:bg-white/5 transition-colors">
                  All measurements <ChevronDown size={16} />
                </button>
                <button className="px-6 py-3 flex items-center gap-4 hover:bg-white/5 transition-colors">
                  One-day range <ChevronDown size={16} />
                </button>
              </div>

              <div className="flex items-center gap-6">
                <button className="w-[30px] h-[30px] bg-black border border-gray-500/25 rounded flex justify-center items-center hover:bg-white/10 transition-colors">
                  <ChevronLeft size={16} className="text-gray-400" />
                </button>
                <span className="text-[26px]">{getFormattedDate()}</span>
                <button className="w-[30px] h-[30px] bg-black border border-gray-500/25 rounded flex justify-center items-center hover:bg-white/10 transition-colors">
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#0B0F14]/60 border border-gray-500/25 rounded-[15px] p-6 relative">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[24px] font-semibold text-[#993737]">
                    Unsolved Alarms
                  </h3>
                  <button className="bg-[#0B0F14]/60 border border-gray-500/25 text-white px-4 py-1.5 rounded-[10px] text-[15px] flex items-center gap-2 hover:bg-white/10 transition-colors">
                    View All <ChevronRight size={14} />
                  </button>
                </div>
                <div className="flex flex-col">
                  {dummyAlarms.map((alarm, idx) => (
                    <AlarmRow key={idx} {...alarm} isSolved={false} />
                  ))}
                </div>
              </div>

              <div className="bg-[#0B0F14]/60 border border-gray-500/25 rounded-[15px] p-6 relative">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[24px] font-semibold text-[#3E9479]">
                    Solved Alarms
                  </h3>
                  <button className="bg-[#0B0F14]/60 border border-gray-500/25 text-white px-4 py-1.5 rounded-[10px] text-[15px] flex items-center gap-2 hover:bg-white/10 transition-colors">
                    View All <ChevronRight size={14} />
                  </button>
                </div>
                <div className="flex flex-col">
                  {dummyAlarms.map((alarm, idx) => (
                    <AlarmRow key={idx} {...alarm} isSolved={false} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;