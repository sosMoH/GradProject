import React, { useState } from "react";
import Header from "../components/Header";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Inbox,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { getFormattedDate } from "../components/Header";

// --- IMPORT YOUR LOCAL IMAGES HERE ---
import imgRoom from "../assets/alarms_locations/bedroom.png";
import imgGarden from "../assets/alarms_locations/garden.png";
import imgRoof from "../assets/alarms_locations/roof.png";

// --- Safe Level Data Configurations ---
export const aqiSafeLevel = {
  markers: [
    { value: "50", left: "25%" },
    { value: "200", left: "75%" },
  ],
  ranges: [
    { label: "Good:", value: "0–50", color: "#00E400" },
    { label: "Moderate:", value: "51–100", color: "#FFFF00" },
    { label: "Unhealthy:", value: "151–200", color: "#FF0000" },
    { label: "Very Unhealthy:", value: "201–300", color: "#8F3F97" },
    { label: "Hazardous:", value: "301–500", color: "#7E0023" },
  ],
};

export const pm25SafeLevel = {
  markers: [
    { value: "13", left: "20%" },
    { value: "150", left: "75%" },
  ],
  ranges: [
    { label: "Good:", value: "0–12", color: "#00E400" },
    { label: "Moderate:", value: "13–35", color: "#FFFF00" },
    { label: "Unhealthy:", value: "56–150", color: "#FF0000" },
    { label: "Very Unhealthy:", value: "151–250", color: "#8F3F97" },
    { label: "Hazardous:", value: "251–500", color: "#7E0023" },
  ],
};

export const co2SafeLevel = {
  markers: [
    { value: "800", left: "25%" },
    { value: "1500", left: "60%" },
  ],
  ranges: [
    { label: "Good:", value: "0–50", color: "#00E400" },
    { label: "Moderate:", value: "51–100", color: "#FFFF00" },
    { label: "Unhealthy:", value: "151–200", color: "#FF0000" },
    { label: "Very Unhealthy:", value: "201–300", color: "#8F3F97" },
    { label: "Hazardous:", value: "301–500", color: "#7E0023" },
  ],
};

export const no2SafeLevel = {
  markers: [{ value: "200", left: "70%" }],
  ranges: [
    { label: "Good:", value: "0–21", color: "#00E400" },
    { label: "Moderate:", value: "22–53", color: "#FFFF00" },
    { label: "Unhealthy:", value: "101–360", color: "#FF0000" },
    { label: "Very Unhealthy:", value: "361–649", color: "#8F3F97" },
    { label: "Hazardous:", value: "650–500", color: "#7E0023" },
  ],
};

// 1. DYNAMIC GAUGE CARD Component
const GaugeCard = ({
  title,
  value,
  unit,
  color,
  percentage,
  textColor,
  safeLevelData,
}: any) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const arcLength = 314.16;
  const offset = arcLength - percentage * arcLength;
  const rotation = -120 + percentage * 240;

  return (
    <div
      className={`bg-[#0B0F14]/60 border border-gray-500/25 rounded-[25px] p-6 flex flex-col items-center relative w-full max-w-[250px] aspect-square justify-between transition-all duration-300 ${isTooltipOpen ? "z-50 border-gray-400/50" : "z-10"}`}
    >
      <h3 className="text-white text-2xl w-full text-left font-semibold">
        {title}
      </h3>

      <div className="relative w-full flex justify-center mt-2">
        <svg
          viewBox="0 0 200 160"
          className="w-[160px] h-[130px] overflow-visible"
        >
          <path
            d="M 35 137.5 A 75 75 0 1 1 165 137.5"
            fill="none"
            stroke="#EAEAEA"
            strokeWidth="20"
            strokeLinecap="round"
          />
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
          <g
            transform={`rotate(${rotation}, 100, 100)`}
            className="transition-all duration-1000 ease-out"
          >
            <polygon points="100,14 94,2 106,2" fill="#FFF" />
          </g>
        </svg>
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

      <HelpCircle
        size={18}
        className={`text-gray-500 mt-2 cursor-pointer transition-colors relative z-20 ${isTooltipOpen ? "text-white" : "hover:text-white"}`}
        onClick={() => setIsTooltipOpen(!isTooltipOpen)}
      />

      {/* --- SAFE LEVEL DROPDOWN POPUP --- */}
      <AnimatePresence>
        {isTooltipOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[calc(100%-25px)] left-[-1px] right-[-1px] bg-[#0B0F14] border border-gray-500/50 rounded-[20px] p-5 shadow-2xl flex flex-col z-50"
          >
            {/* The little up-pointing triangle (Caret) */}
            <div className="absolute -top-[7px] left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#0B0F14] border-t border-l border-gray-500/50 rotate-45 rounded-tl-[2px]" />

            <div className="flex justify-between items-center mb-6 relative">
              <span className="text-white text-[15px] font-medium w-full text-center">
                {title} safe level
              </span>
              <XCircle
                size={20}
                className="text-gray-500 cursor-pointer hover:text-white transition-colors absolute right-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTooltipOpen(false);
                }}
              />
            </div>

            <div
              className="relative w-full h-2 rounded-full mb-6 mt-2"
              style={{
                background:
                  "linear-gradient(to right, #00E400, #FFFF00, #FF0000, #8F3F97, #7E0023)",
              }}
            >
              {safeLevelData.markers.map((marker: any, idx: number) => (
                <div
                  key={idx}
                  className="absolute top-[-16px] flex flex-col items-center -translate-x-1/2"
                  style={{ left: marker.left }}
                >
                  <span className="text-[10px] text-gray-300 leading-none">
                    {marker.value}
                  </span>
                  <div className="w-[1px] h-[6px] bg-white mt-1" />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              {safeLevelData.ranges.map((row: any, idx: number) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-[13px] font-medium tracking-wide"
                >
                  <span style={{ color: row.color }}>{row.label}</span>
                  <span className="text-gray-100">{row.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 2. Small Alarm Row Component
const AlarmRow = ({ time, type, pm25, isSolved, image }: any) => (
  <div className="flex items-center justify-between text-[16px] md:text-[18px] text-white/70 py-3 border-b border-gray-500/10 last:border-0">
    <div className="flex items-center gap-4">
      <img
        src={image}
        alt={`${type} location`}
        className="w-[70px] h-[40px] rounded-[10px] object-cover"
      />
      <span className="font-mono">{time}</span>
      <span className="font-bold text-white w-[60px]">{type}</span>
    </div>
    <div className="flex items-center gap-6">
      <span>{pm25}</span>
      <div
        className={`w-6 h-6 border ${isSolved ? "bg-[#3E9479] border-[#3E9479]" : "border-gray-500"} rounded-sm`}
      />
    </div>
  </div>
);

// --- MAIN Overview Page Component ---
const OverviewPage: React.FC = () => {
  const [expandedView, setExpandedView] = useState<
    "unsolved" | "solved" | null
  >(null);

  const dummyAlarms = [
    {
      id: 1,
      locationName: "Bedroom",
      time: "2026-05-02 18:33",
      type: "PM2.5",
      aqi: "110",
      pm25: "30µg/m³",
      co2: "1224ppm",
      no2: "98ppb",
      image: imgRoom,
    },
    {
      id: 2,
      locationName: "Garden",
      time: "2026-05-02 18:33",
      type: "CO2",
      aqi: "110",
      pm25: "30µg/m³",
      co2: "1224ppm",
      no2: "98ppb",
      image: imgGarden,
    },
    {
      id: 3,
      locationName: "Roof",
      time: "2026-05-02 18:33",
      type: "PM2.5",
      aqi: "110",
      pm25: "30µg/m³",
      co2: "1224ppm",
      no2: "98ppb",
      image: imgRoof,
    },
  ];

  return (
    <div className="relative w-full min-h-full bg-[#04070C] font-sans flex flex-col pb-[70px] md:pb-0 overflow-x-hidden">
      
      {/* --- OVERLAY ANIMATION FOR EXPANDED VIEW --- */}
      <AnimatePresence>
        {expandedView && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 bg-[#04070C]/90 backdrop-blur-sm">
            <motion.div
              layoutId={`card-${expandedView}`}
              className="w-full max-w-[1200px] h-full max-h-[750px] bg-[#0B0F14] border border-gray-500/25 rounded-[15px] p-8 md:p-12 flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  {expandedView === "unsolved" ? (
                    <AlertCircle fill="#830202" color="white" size={36} />
                  ) : (
                    <CheckCircle2 color="#3E9479" size={36} />
                  )}
                  <div>
                    <h2
                      className={`text-[32px] font-bold leading-tight ${expandedView === "unsolved" ? "text-[#830202]" : "text-[#3E9479]"}`}
                    >
                      {expandedView === "unsolved"
                        ? "Unsolved Alarms"
                        : "Solved Alarms"}
                    </h2>
                    <p className="text-gray-500 text-sm">3 active alarms</p>
                  </div>
                </div>

                <button
                  onClick={() => setExpandedView(null)}
                  className="w-10 h-10 border border-gray-500/25 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft size={24} className="text-white" />
                </button>
              </div>

              {/* --- SCROLLABLE TABLE WRAPPER FOR MOBILE --- */}
              <div className="w-full overflow-x-auto pb-4">
                <div className="min-w-[900px] flex flex-col">
                  
                  {/* Detailed Table Header */}
                  <div className="grid grid-cols-[2fr_2fr_1fr_1.5fr_1.5fr_1.5fr_1fr] gap-4 text-[#888888] font-semibold text-[20px] pb-4 border-b border-gray-500/25 text-center px-4">
                    <div className="text-left pl-2">location</div>
                    <div className="text-left">Time</div>
                    <div>AQI</div>
                    <div>PM2.5</div>
                    <div>CO₂</div>
                    <div>NO₂</div>
                    <div>Status</div>
                  </div>

                  {/* Detailed Table Rows */}
                  <div className="flex flex-col overflow-y-auto max-h-[40vh] md:max-h-[500px]">
                    {dummyAlarms.map((alarm, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-[2fr_2fr_1fr_1.5fr_1.5fr_1.5fr_1fr] gap-4 items-center py-6 text-white/90 text-[18px] border-b border-gray-500/10 text-center px-4 hover:bg-white/5 transition-colors"
                      >
                        <div className="flex items-center gap-4 text-left border-r border-gray-500/25">
                          <img
                            src={alarm.image}
                            className="w-16 h-16 rounded-[10px] object-cover flex-shrink-0"
                            alt="Location"
                          />
                          <span className="whitespace-nowrap">{alarm.locationName}</span>
                        </div>
                        <div className="text-left font-mono border-r border-gray-500/25 pl-4 whitespace-nowrap">
                          {alarm.time}
                        </div>
                        <div className="border-r border-gray-500/25">{alarm.aqi}</div>
                        <div className="border-r border-gray-500/25">{alarm.pm25}</div>
                        <div className="border-r border-gray-500/25">{alarm.co2}</div>
                        <div className="border-r border-gray-500/25">{alarm.no2}</div>
                        <div className="flex justify-center">
                          <div
                            className={`w-6 h-6 border rounded-sm flex-shrink-0 ${expandedView === "solved" ? "bg-[#3E9479] border-[#3E9479]" : "border-gray-500"}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                </div>
              </div>

              <div className="mt-auto flex flex-col items-center justify-center pt-8 opacity-40">
                <div className="relative mb-2">
                  <Inbox size={60} strokeWidth={1} className="text-[#3E9479]" />
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-2">
                    <div className="w-1 h-3 bg-[#3E9479] rounded-full rotate-[-45deg]" />
                    <div className="w-1 h-4 bg-[#3E9479] rounded-full" />
                    <div className="w-1 h-3 bg-[#3E9479] rounded-full rotate-[45deg]" />
                  </div>
                </div>
                <p className="text-[16px] font-medium text-gray-400">
                  {expandedView === "unsolved"
                    ? "No More Unsolved Alarms"
                    : "No More Solved Alarms"}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col w-full relative z-10">
        <Header
          title="AIR QUALITY MONITORING AND CONTROL"
          dateColor="text-white"
          bellColor="text-[#0A7C56]"
        />

        <div className="px-6 md:px-12 py-8 flex flex-col gap-10 max-w-[1440px] mx-auto w-full">
          <section className="relative z-20">
            <h2 className="text-[32px] text-[#0A7C56] mb-6">Latest status</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center md:justify-items-start z-20 relative">
              <GaugeCard
                title="AQI"
                value="153"
                unit=""
                color="#FF8B16"
                textColor="#FF8B16"
                percentage={0.7}
                safeLevelData={aqiSafeLevel}
              />
              <GaugeCard
                title="PM2.5"
                value="143"
                unit="µg/m³"
                color="#9C0D0D"
                textColor="#9C0D0D"
                percentage={0.8}
                safeLevelData={pm25SafeLevel}
              />
              <GaugeCard
                title="CO₂"
                value="1500"
                unit="ppm"
                color="#FF8B16"
                textColor="#FF8D28"
                percentage={0.6}
                safeLevelData={co2SafeLevel}
              />
              <GaugeCard
                title="NO₂"
                value="100"
                unit="ppb"
                color="#FF8B16"
                textColor="#FF8D28"
                percentage={0.4}
                safeLevelData={no2SafeLevel}
              />
            </div>
          </section>

          <section className="relative z-10">
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
              <motion.div
                layoutId="card-unsolved"
                className="bg-[#0B0F14]/60 border border-gray-500/25 rounded-[15px] p-6 relative"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[24px] font-semibold text-[#993737]">
                    Unsolved Alarms
                  </h3>
                  <button
                    onClick={() => setExpandedView("unsolved")}
                    className="bg-[#0B0F14]/60 border border-gray-500/25 text-white px-4 py-1.5 rounded-[10px] text-[15px] flex items-center gap-2 hover:bg-white/10 transition-colors z-10 relative"
                  >
                    View All <ChevronRight size={14} />
                  </button>
                </div>
                <div className="flex flex-col">
                  {dummyAlarms.map((alarm, idx) => (
                    <AlarmRow key={idx} {...alarm} isSolved={false} />
                  ))}
                </div>
              </motion.div>

              <motion.div
                layoutId="card-solved"
                className="bg-[#0B0F14]/60 border border-gray-500/25 rounded-[15px] p-6 relative"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[24px] font-semibold text-[#3E9479]">
                    Solved Alarms
                  </h3>
                  <button
                    onClick={() => setExpandedView("solved")}
                    className="bg-[#0B0F14]/60 border border-gray-500/25 text-white px-4 py-1.5 rounded-[10px] text-[15px] flex items-center gap-2 hover:bg-white/10 transition-colors z-10 relative"
                  >
                    View All <ChevronRight size={14} />
                  </button>
                </div>
                <div className="flex flex-col">
                  {dummyAlarms.map((alarm, idx) => (
                    <AlarmRow key={idx} {...alarm} isSolved={true} />
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;