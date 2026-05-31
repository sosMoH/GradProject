import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, ChevronDown, Power, AlertCircle } from "lucide-react";

import Header, { getFormattedDate } from "../components/Header";
import { useSensorData } from "../hooks/useSensorData";

import GaugeCard from "../components/GaugeCard";
import AlarmRow from "../components/AlarmRow";
import ExpandedAlarmsModal from "../components/ExpandedAlarmsModal";

import { aqiSafeLevel, pm25SafeLevel, co2SafeLevel, no2SafeLevel } from "../data/safeLevels";

import imgRoom from "../assets/alarms_locations/bedroom.png";
import imgGarden from "../assets/alarms_locations/garden.png";
import imgRoof from "../assets/alarms_locations/roof.png";

// --- SECTION: Translation Dictionary ---
const translations = {
  en: {
    title: "AIR QUALITY MONITORING AND CONTROL",
    latestStatus: "Latest status",
    historyData: "History data",
    stopSystem: "Stop System",
    startSystem: "Start System",
    allMeasurements: "All measurements",
    oneDayRange: "One-day range",
    twoDayRange: "Two-days range",
    threeDayRange: "Three-days range",
    unsolvedAlarms: "Unsolved Alarms",
    solvedAlarms: "Solved Alarms",
    viewAll: "View All",
    headerAlert: "concentration has reached hazardous levels!",
    popupAlert: "concentration has reached hazardous levels.",
    close: "Close"
  },
  ar: {
    title: "مراقبة جودة الهواء والتحكم بها",
    latestStatus: "أحدث الحالات",
    historyData: "البيانات التاريخية",
    stopSystem: "إيقاف النظام",
    startSystem: "تشغيل النظام",
    allMeasurements: "جميع القياسات",
    oneDayRange: "نطاق يوم واحد",
    twoDayRange: "نطاق يومين",
    threeDayRange: "نطاق ثلاثة أيام",
    unsolvedAlarms: "إنذارات غير محلولة",
    solvedAlarms: "إنذارات محلولة",
    viewAll: "عرض الكل",
    headerAlert: "وصلت إلى مستويات خطيرة!",
    popupAlert: "وصلت إلى مستويات خطيرة.",
    close: "إغلاق"
  }
};

// Helper function to format dummy dates dynamically to "YYYY-MM-DD HH:MM"
const formatDummyDate = (dateObj: Date, timeStr: string) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d} ${timeStr}`;
};

const OverviewPage: React.FC = () => {
  // --- SECTION: Dynamic Date Calculation ---
  // This automatically finds the real "Today" and precisely 2 days ago!
  const { today, minDate } = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0); // Zero out the time so midnight matches perfectly

    const m = new Date(t);
    m.setDate(t.getDate() - 2); // Exactly 2 days before today
    
    return { today: t, minDate: m };
  }, []);

  // --- SECTION: States ---
  const [lang, setLang] = useState<"en" | "ar">("en");
  const t = (key: keyof typeof translations["en"]) => translations[lang][key];

  const [expandedView, setExpandedView] = useState<"unsolved" | "solved" | null>(null);
  const [isSystemOn, setIsSystemOn] = useState(true);

  // Filter States (Default to real today)
  const [currentDate, setCurrentDate] = useState<Date>(today); 
  const [dayRange, setDayRange] = useState<1 | 2 | 3>(1);
  const [isRangeMenuOpen, setIsRangeMenuOpen] = useState(false);

  // Alerts State
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);
  const liveSensors = useSensorData(isSystemOn);

  // --- SECTION: Dummy Data ---
  // Using dynamic dates here so the UI still works no matter what real day it is
  const [alarms, setAlarms] = useState(() => {
    const yesterday = new Date(today); 
    yesterday.setDate(today.getDate() - 1);
    
    const twoDaysAgo = new Date(today); 
    twoDaysAgo.setDate(today.getDate() - 2);

    return [
      { id: 1, locationName: "Bedroom", time: formatDummyDate(today, "18:33"), type: "PM2.5", aqi: "110", pm25: "30µg/m³", co2: "1224ppm", no2: "98ppb", image: imgRoom, isSolved: false },
      { id: 2, locationName: "Garden", time: formatDummyDate(yesterday, "14:15"), type: "CO₂", aqi: "110", pm25: "30µg/m³", co2: "1224ppm", no2: "98ppb", image: imgGarden, isSolved: false },
      { id: 3, locationName: "Roof", time: formatDummyDate(twoDaysAgo, "09:10"), type: "PM2.5", aqi: "110", pm25: "30µg/m³", co2: "1224ppm", no2: "98ppb", image: imgRoof, isSolved: true },
      { id: 4, locationName: "Bedroom", time: formatDummyDate(today, "22:00"), type: "AQI", aqi: "110", pm25: "30µg/m³", co2: "1224ppm", no2: "98ppb", image: imgRoom, isSolved: true },
    ];
  });

  // --- SECTION: Hazardous Alert Logic ---
  const activeHazardousSensors = useMemo(() => {
    const hazardous = [];
    if (liveSensors.aqi >= 301) hazardous.push("AQI");
    if (liveSensors.pm25 >= 251) hazardous.push("PM2.5");
    if (liveSensors.co2 >= 301) hazardous.push("CO₂");
    if (liveSensors.no2 >= 501) hazardous.push("NO₂");
    return hazardous;
  }, [liveSensors]);

  useEffect(() => {
    setAcknowledgedAlerts((prev) => prev.filter((sensor) => activeHazardousSensors.includes(sensor)));
  }, [activeHazardousSensors]);

  const currentPopupAlert = activeHazardousSensors.find((sensor) => !acknowledgedAlerts.includes(sensor));

  const handleCloseAlert = (sensor: string) => {
    setAcknowledgedAlerts([...acknowledgedAlerts, sensor]);
  };

  // --- SECTION: Date & Filtering Logic ---
  const handleToggleSystem = async () => {
    if (!window.confirm(`Are you sure you want to ${isSystemOn ? "stop" : "start"} the system?`)) return;
    setIsSystemOn(!isSystemOn);
  };

  const toggleAlarm = (id: number) => {
    setAlarms((prevAlarms) =>
      prevAlarms.map((alarm) => (alarm.id === id ? { ...alarm, isSolved: !alarm.isSolved } : alarm))
    );
  };

  // Safe constraints for Prev/Next Day buttons based on the dynamic today & minDate
  const isPrevDisabled = currentDate.getTime() <= minDate.getTime();
  const isNextDisabled = currentDate.getTime() >= today.getTime();

  const handlePrevDay = () => {
    if (!isPrevDisabled) setCurrentDate((prev) => new Date(prev.getTime() - 86400000));
  };
  const handleNextDay = () => {
    if (!isNextDisabled) setCurrentDate((prev) => new Date(prev.getTime() + 86400000));
  };

  const filteredAlarms = useMemo(() => {
    return alarms.filter((alarm) => {
      const alarmDate = new Date(alarm.time.split(" ")[0]); 
      alarmDate.setHours(0, 0, 0, 0);

      const endDate = new Date(currentDate);
      endDate.setHours(0, 0, 0, 0);

      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - (dayRange - 1));

      return alarmDate >= startDate && alarmDate <= endDate;
    });
  }, [alarms, currentDate, dayRange]);

  const unsolvedAlarms = filteredAlarms.filter((a) => !a.isSolved);
  const solvedAlarms = filteredAlarms.filter((a) => a.isSolved);
  const displayedExpandedAlarms = expandedView === "unsolved" ? unsolvedAlarms : solvedAlarms;

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="relative w-full min-h-screen bg-[#04070C] font-sans flex flex-col pb-[70px] md:pb-0 overflow-x-hidden">
      
      {/* --- SECTION: Popups & Modals --- */}
      <AnimatePresence>
        {expandedView && (
          <ExpandedAlarmsModal
            expandedView={expandedView}
            setExpandedView={setExpandedView}
            displayedExpandedAlarms={displayedExpandedAlarms}
            toggleAlarm={toggleAlarm}
          />
        )}

        {currentPopupAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <div className="bg-[#11161D] border border-gray-600 rounded-2xl p-6 md:p-8 flex flex-col items-center max-w-sm text-center shadow-[0_0_30px_rgba(255,107,107,0.15)] pointer-events-auto">
              <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center mb-4">
                <AlertCircle size={28} className="text-white" />
              </div>
              <p className="text-white text-lg font-medium leading-snug mb-6">
                {currentPopupAlert} {t("popupAlert")}
              </p>
              <button
                onClick={() => handleCloseAlert(currentPopupAlert)}
                className="bg-[#242C36] text-white px-8 py-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                {t("close")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`flex-1 flex flex-col w-full relative z-10 ${currentPopupAlert ? "blur-sm transition-all duration-300" : ""}`}>
        
        <Header
          title={t("title")}
          dateColor="text-white"
          bellColor="text-[#0A7C56]"
          lang={lang}
          setLang={setLang}
          currentDate={currentDate}
          activeAlerts={activeHazardousSensors}
          t={t}
        />

        <div className="px-6 md:px-12 py-8 flex flex-col gap-10 max-w-[1440px] mx-auto w-full">
          
          <section className="relative z-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-[32px] text-[#0A7C56]">{t("latestStatus")}</h2>
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
                  {isSystemOn ? t("stopSystem") : t("startSystem")}
                </span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center md:justify-items-start z-20 relative">
              <GaugeCard title="AQI" value={liveSensors.aqi} unit="" percentage={isSystemOn ? liveSensors.aqi / 500 : 0} safeLevelData={aqiSafeLevel} isSystemOn={isSystemOn} />
              <GaugeCard title="PM2.5" value={liveSensors.pm25} unit="µg/m³" percentage={isSystemOn ? liveSensors.pm25 / 500 : 0} safeLevelData={pm25SafeLevel} isSystemOn={isSystemOn} />
              <GaugeCard title="CO₂" value={liveSensors.co2} unit="ppm" percentage={isSystemOn ? liveSensors.co2 / 500 : 0} safeLevelData={co2SafeLevel} isSystemOn={isSystemOn} />
              <GaugeCard title="NO₂" value={liveSensors.no2} unit="ppb" percentage={isSystemOn ? liveSensors.no2 / 500 : 0} safeLevelData={no2SafeLevel} isSystemOn={isSystemOn} />
            </div>
          </section>

          <section className="relative z-10">
            <h2 className="text-[32px] text-[#0A7C56] mb-6">{t("historyData")}</h2>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 text-white w-full">
              
              <div className="flex flex-wrap gap-0 bg-[#0B0F14]/60 border border-gray-500/25 rounded-[15px] relative">
                <button 
                  className={`px-6 py-3 ${lang === "ar" ? "border-l rounded-r-[15px]" : "border-r rounded-l-[15px]"} border-gray-500/25 flex items-center gap-4 hover:bg-white/5 transition-colors`}
                >
                  {t("allMeasurements")} <ChevronDown size={16} />
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setIsRangeMenuOpen(!isRangeMenuOpen)}
                    className={`px-6 py-3 flex items-center gap-4 hover:bg-white/5 transition-colors h-full ${lang === "ar" ? "rounded-l-[15px]" : "rounded-r-[15px]"}`}
                  >
                    {dayRange === 1 ? t("oneDayRange") : dayRange === 2 ? t("twoDayRange") : t("threeDayRange")} 
                    <ChevronDown size={16} />
                  </button>
                  {isRangeMenuOpen && (
                    <div className="absolute top-full left-0 w-full min-w-[200px] bg-[#0B0F14] border border-gray-500/25 rounded-xl shadow-2xl z-50 mt-2 overflow-hidden">
                      <button onClick={() => { setDayRange(1); setIsRangeMenuOpen(false); }} className="block w-full text-left px-4 py-3 hover:bg-white/10 text-sm transition-colors">{t("oneDayRange")}</button>
                      <button onClick={() => { setDayRange(2); setIsRangeMenuOpen(false); }} className="block w-full text-left px-4 py-3 hover:bg-white/10 text-sm transition-colors">{t("twoDayRange")}</button>
                      <button onClick={() => { setDayRange(3); setIsRangeMenuOpen(false); }} className="block w-full text-left px-4 py-3 hover:bg-white/10 text-sm transition-colors">{t("threeDayRange")}</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6" dir="ltr">
                <button 
                  onClick={handlePrevDay} 
                  disabled={isPrevDisabled}
                  className={`w-[30px] h-[30px] bg-black border border-gray-500/25 rounded flex justify-center items-center transition-colors ${isPrevDisabled ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10"}`}
                >
                  <ChevronLeft size={16} className="text-gray-400" />
                </button>
                
                <span className="text-[26px] min-w-[200px] text-center">{getFormattedDate(currentDate, lang)}</span>
                
                <button 
                  onClick={handleNextDay} 
                  disabled={isNextDisabled}
                  className={`w-[30px] h-[30px] bg-black border border-gray-500/25 rounded flex justify-center items-center transition-colors ${isNextDisabled ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10"}`}
                >
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div layoutId="card-unsolved" className="bg-[#0B0F14]/60 border border-gray-500/25 rounded-[15px] p-6 relative">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[24px] font-semibold text-[#993737]">{t("unsolvedAlarms")}</h3>
                  <button onClick={() => setExpandedView("unsolved")} className="bg-[#0B0F14]/60 border border-gray-500/25 text-white px-4 py-1.5 rounded-[10px] text-[15px] flex items-center gap-2 hover:bg-white/10 transition-colors z-10 relative">
                    {t("viewAll")} {lang === "ar" ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                  </button>
                </div>
                <div className="flex flex-col">
                  <AnimatePresence mode="popLayout">
                    {unsolvedAlarms.length > 0 ? (
                      unsolvedAlarms.map((alarm) => <AlarmRow key={alarm.id} {...alarm} onToggle={toggleAlarm} />)
                    ) : (
                      <p className="text-gray-500 text-center py-4 text-sm">No alarms found for selected dates.</p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              <motion.div layoutId="card-solved" className="bg-[#0B0F14]/60 border border-gray-500/25 rounded-[15px] p-6 relative">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[24px] font-semibold text-[#3E9479]">{t("solvedAlarms")}</h3>
                  <button onClick={() => setExpandedView("solved")} className="bg-[#0B0F14]/60 border border-gray-500/25 text-white px-4 py-1.5 rounded-[10px] text-[15px] flex items-center gap-2 hover:bg-white/10 transition-colors z-10 relative">
                    {t("viewAll")} {lang === "ar" ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                  </button>
                </div>
                <div className="flex flex-col">
                  <AnimatePresence mode="popLayout">
                    {solvedAlarms.length > 0 ? (
                      solvedAlarms.map((alarm) => <AlarmRow key={alarm.id} {...alarm} onToggle={toggleAlarm} />)
                    ) : (
                      <p className="text-gray-500 text-center py-4 text-sm">No alarms found for selected dates.</p>
                    )}
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