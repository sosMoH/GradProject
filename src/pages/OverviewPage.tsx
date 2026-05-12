import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, ChevronDown, Power } from "lucide-react";

import Header, { getFormattedDate } from "../components/Header";
import { useSensorData } from "../hooks/useSensorData";

import GaugeCard from "../components/GaugeCard";
import AlarmRow from "../components/AlarmRow";
import ExpandedAlarmsModal from "../components/ExpandedAlarmsModal";

import {
  aqiSafeLevel,
  pm25SafeLevel,
  co2SafeLevel,
  no2SafeLevel,
} from "../data/safeLevels";

import imgRoom from "../assets/alarms_locations/bedroom.png";
import imgGarden from "../assets/alarms_locations/garden.png";
import imgRoof from "../assets/alarms_locations/roof.png";

const OverviewPage: React.FC = () => {
  const [expandedView, setExpandedView] = useState<
    "unsolved" | "solved" | null
  >(null);
  const [isSystemOn, setIsSystemOn] = useState(true);

  // Hook for LIVE DATA (Freezes automatically when isSystemOn is false)
  const liveSensors = useSensorData(isSystemOn);

  const [alarms, setAlarms] = useState([
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
      isSolved: false,
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
      isSolved: false,
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
      isSolved: true,
    },
  ]);

  const toggleAlarm = (id: number) => {
    setAlarms((prevAlarms) =>
      prevAlarms.map((alarm) =>
        alarm.id === id ? { ...alarm, isSolved: !alarm.isSolved } : alarm,
      ),
    );
  };

  const unsolvedAlarms = alarms.filter((a) => !a.isSolved);
  const solvedAlarms = alarms.filter((a) => a.isSolved);
  const displayedExpandedAlarms =
    expandedView === "unsolved" ? unsolvedAlarms : solvedAlarms;

  const handleToggleSystem = async () => {
    const actionText = isSystemOn ? "stop" : "start";

    if (!window.confirm(`Are you sure you want to ${actionText} the system?`))
      return;

    try {
      alert(`System ${isSystemOn ? "stopped" : "started"} successfully!`);
      setIsSystemOn(!isSystemOn);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative w-full min-h-full bg-[#04070C] font-sans flex flex-col pb-[70px] md:pb-0 overflow-x-hidden">
      <AnimatePresence>
        {expandedView && (
          <ExpandedAlarmsModal
            expandedView={expandedView}
            setExpandedView={setExpandedView}
            displayedExpandedAlarms={displayedExpandedAlarms}
            toggleAlarm={toggleAlarm}
          />
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-[32px] text-[#0A7C56]">Latest status</h2>

              <button
                onClick={handleToggleSystem}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-[12px] transition-all duration-300 shadow-lg ${
                  isSystemOn
                    ? "bg-[#993737]/20 border border-[#993737] text-[#ff6b6b] hover:bg-[#993737] hover:text-white shadow-[0_0_15px_rgba(153,55,55,0.3)]"
                    : "bg-[#3E9479]/20 border border-[#3E9479] text-[#A7F3D0] hover:bg-[#3E9479] hover:text-white shadow-[0_0_15px_rgba(62,148,121,0.3)]"
                }`}
              >
                <Power size={18} />
                <span className="font-semibold tracking-wide">
                  {isSystemOn ? "Stop System" : "Start System"}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center md:justify-items-start z-20 relative">
              <GaugeCard
                title="AQI"
                value={liveSensors.aqi}
                unit=""
                percentage={isSystemOn ? liveSensors.aqi / 500 : 0}
                safeLevelData={aqiSafeLevel}
                isSystemOn={isSystemOn}
              />
              <GaugeCard
                title="PM2.5"
                value={liveSensors.pm25}
                unit="µg/m³"
                percentage={isSystemOn ? liveSensors.pm25 / 500 : 0}
                safeLevelData={pm25SafeLevel}
                isSystemOn={isSystemOn}
              />
              <GaugeCard
                title="CO₂"
                value={liveSensors.co2}
                unit="ppm"
                percentage={isSystemOn ? liveSensors.co2 / 5000 : 0}
                safeLevelData={co2SafeLevel}
                isSystemOn={isSystemOn}
              />
              <GaugeCard
                title="NO₂"
                value={liveSensors.no2}
                unit="ppb"
                percentage={isSystemOn ? liveSensors.no2 / 500 : 0}
                safeLevelData={no2SafeLevel}
                isSystemOn={isSystemOn}
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
                  <AnimatePresence mode="popLayout">
                    {unsolvedAlarms.map((alarm) => (
                      <AlarmRow
                        key={alarm.id}
                        {...alarm}
                        onToggle={toggleAlarm}
                      />
                    ))}
                  </AnimatePresence>
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
                  <AnimatePresence mode="popLayout">
                    {solvedAlarms.map((alarm) => (
                      <AlarmRow
                        key={alarm.id}
                        {...alarm}
                        onToggle={toggleAlarm}
                      />
                    ))}
                  </AnimatePresence>
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
