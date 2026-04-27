import React from "react";
import Sidebar from "./SideBar";
import Header from "./Header";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  HelpCircle,
} from "lucide-react";

// --- Custom Components for the Overview Page ---

// 1. DYNAMIC GAUGE CARD Component
// This is how you change the "circles" based on data.
// It takes data parameters as props and uses them to update the SVG path.
const GaugeCard = ({
  title,
  value,
  unit,
  color,
  percentage,
  textColor,
}: any) => {
  // Simple math for the elliptical semi-circle SVG arc path
  const radius = 80;
  const circumference = radius * Math.PI; // Full full-circle is 2*PI*R, semi is half that

  // We use stroke-dashoffset to fill the arc based on percentage.
  // When percentage is 0.0, offset is 'circumference' (0% filled).
  // When percentage is 1.0, offset is 0 (100% filled).
  const offset = circumference - percentage * circumference;

  return (
    <div className="bg-[#0B0F14]/60 border border-gray-500/25 rounded-[25px] p-6 flex flex-col items-center relative w-full max-w-[250px] aspect-square justify-between">
      {/* Title */}
      <h3 className="text-white text-2xl w-full text-left font-semibold">
        {title}
      </h3>

      {/* Dynamic Gauge Graphic (SVG semi-circle) */}
      <div className="relative w-full flex justify-center mt-2">
        <svg
          viewBox="0 0 200 120"
          className="w-[160px] h-[100px] overflow-visible"
        >
          {/* Grey Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#EAEAEA"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Dynamic Colored Arc - Updates based on 'percentage' */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            // This is the magic: we update the dashoffset
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out" // Added transition for smooth change
          />

          {/* Standard Indicator Triangle - Positioning it at the end of the full arc is easier */}
          <polygon
            points="175,10 185,25 165,25"
            fill="#FFF"
            transform={`rotate(${percentage * 180} 100 100)`}
          />
        </svg>

        {/* Center Value and Unit */}
        <div className="absolute top-[40%] flex flex-col items-center">
          {/* SECOND FIX: Dynamic Text Color based on data */}
          <span
            className={`text-[32px] font-semibold leading-none`}
            style={{ color: textColor }}
          >
            {value}
          </span>
          <span className="text-gray-400 text-sm mt-1">{unit}</span>
        </div>
      </div>

      {/* Standard Question Mark Icon */}
      <HelpCircle size={18} className="text-gray-500 mt-4 cursor-pointer" />
    </div>
  );
};

// 2. Alarm Row Component
const AlarmRow = ({ id, time, type, value, isSolved }: any) => (
  <div className="flex items-center justify-between text-[16px] md:text-[18px] text-white/70 py-3 border-b border-gray-500/10 last:border-0">
    <div className="flex items-center gap-4">
      <img
        src="/api/placeholder/70/40"
        alt="Camera view"
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
  // Simple dummy data to populate the alarm tables.
  const dummyAlarms = [
    { id: 1, time: "2021-01-25 18:33", type: "PM2.5", value: "30µg/m³" },
    { id: 2, time: "2021-01-25 18:33", type: "CO2", value: "30µg/m³" },
    { id: 3, time: "2021-01-25 18:33", type: "PM2.5", value: "30µg/m³" },
  ];

  return (
    // Responsive: column on mobile, row on desktop. Added pb-70 for mobile nav.
    <div className="relative w-full min-h-screen bg-[#04070C] font-sans flex flex-col md:flex-row pb-[70px] md:pb-0 overflow-x-hidden">
      {/* Shared Sidebar Component - Set active to "overview" */}
      <Sidebar activePage="overview" />

      {/* Main Content Area - We use flex containers to force scaling */}
      <main className="flex-1 flex flex-col w-full">
        {/* Shared Header Component */}
        <Header
          title="AIR QUALITY MONITORING AND CONTROL"
          dateColor="text-[#0A7C56]"
          bellColor="text-[#0A7C56]"
        />

        {/* This is the content container. px and py reduced for scaling. */}
        <div className="px-6 md:px-12 py-8 flex flex-col gap-10 max-w-[1440px] mx-auto w-full">
          {/* 1. LATEST STATUS SECTION - Clean Grid of 4 Cards */}
          <section>
            <h2 className="text-[32px] text-[#0A7C56] mb-6">Latest status</h2>

            {/* GRID LAYOUT to perfectly match the target image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center md:justify-items-start">
              {/* Dynamic Gauge Cards are populated with data here! */}
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

          {/* 2. HISTORY DATA SECTION */}
          <section>
            <h2 className="text-[32px] text-[#0A7C56] mb-6">History data</h2>

            {/* Timeline Controls and Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 text-white w-full">
              {/* Dropdown Filters (re-styled with standard padding) */}
              <div className="flex flex-wrap gap-0 bg-[#0B0F14]/60 border border-gray-500/25 rounded-[15px] overflow-hidden">
                <button className="px-6 py-3 border-r border-gray-500/25 flex items-center gap-4 hover:bg-white/5 transition-colors">
                  All measurements <ChevronDown size={16} />
                </button>
                <button className="px-6 py-3 flex items-center gap-4 hover:bg-white/5 transition-colors">
                  One-day range <ChevronDown size={16} />
                </button>
              </div>

              {/* Timeline Navigation */}
              <div className="flex items-center gap-6">
                <button className="w-[30px] h-[30px] bg-black border border-gray-500/25 rounded flex justify-center items-center hover:bg-white/10 transition-colors">
                  <ChevronLeft size={16} className="text-gray-400" />
                </button>
                <span className="text-[20px]">Sat Feb 20 2021</span>
                <button className="w-[30px] h-[30px] bg-black border border-gray-500/25 rounded flex justify-center items-center hover:bg-white/10 transition-colors">
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Alarms Section - Flex or grid for two tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Unsolved Alarms Table Card */}
              <div className="bg-[#0B0F14]/60 border border-gray-500/25 rounded-[15px] p-6 relative">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[24px] font-semibold text-[#993737]">
                    Unsolved Alarms
                  </h3>
                  {/* Standard small View All button from target image */}
                  <button className="bg-[#0B0F14]/60 border border-gray-500/25 text-white px-4 py-1.5 rounded-[10px] text-[15px] flex items-center gap-2 hover:bg-white/10 transition-colors">
                    View All <ChevronRight size={14} />
                  </button>
                </div>
                {/* Populate table rows */}
                <div className="flex flex-col">
                  {dummyAlarms.map((alarm, idx) => (
                    <AlarmRow key={idx} {...alarm} isSolved={false} />
                  ))}
                </div>
              </div>

              {/* Solved Alarms Table Card */}
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
                    <AlarmRow key={idx} {...alarm} isSolved={true} />
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
