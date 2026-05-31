import React, { useState, useEffect } from "react";
import { Bell, ChevronDown, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- SECTION: Interfaces & Helpers ---
// Added "?" to make these optional so other pages don't crash when navigating!
interface HeaderProps {
  title: string;
  dateColor?: string;
  bellColor?: string;
  lang?: "en" | "ar";
  setLang?: (lang: "en" | "ar") => void;
  currentDate?: Date;
  activeAlerts?: string[];
  t?: (key: any) => string; 
}

export const getFormattedDate = (date: Date, lang: "en" | "ar"): string => {
  const day = date.getDate();
  const year = date.getFullYear();

  if (lang === "ar") {
    const month = date.toLocaleDateString("ar-EG", { month: "long" });
    return `${day} ${month}، ${year}`;
  } else {
    const month = date.toLocaleDateString("en-US", { month: "long" });
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
  }
};

const Header: React.FC<HeaderProps> = ({
  title,
  dateColor = "text-white",
  bellColor = "text-white",
  // Default fallbacks added here so other pages don't crash:
  lang = "en",
  setLang = () => {}, 
  currentDate = new Date(),
  activeAlerts = [],
  t = (key: any) => key, 
}) => {
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [alertIndex, setAlertIndex] = useState(0);

  // --- SECTION: Cube Curtain Animation Logic ---
  useEffect(() => {
    // Only rotate if there is MORE than 1 alert
    if (activeAlerts.length > 1) {
      const interval = setInterval(() => {
        setAlertIndex((prev) => (prev + 1) % activeAlerts.length);
      }, 3000); // Change text every 3 seconds
      return () => clearInterval(interval);
    } else {
      setAlertIndex(0); // Reset to first if it drops to 1
    }
  }, [activeAlerts.length]);

  // Fallback string if translation is missing on other pages
  const getAlertMessage = () => {
    const translated = t("headerAlert");
    return translated === "headerAlert" ? "concentration has reached hazardous levels!" : translated;
  };

  const currentIndex = alertIndex >= activeAlerts.length ? 0 : alertIndex;

  return (
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 px-6 md:pt-8 md:pr-12 md:pl-8 gap-4 sm:gap-0 relative z-50">
      
      {/* --- SECTION: Title & Alerts Area --- */}
      <div className="w-full sm:w-2/3 overflow-hidden h-[50px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {activeAlerts.length > 0 ? (
            
            // HAZARDOUS ALERT (Cube Curtain Effect)
            <motion.div
              key="alert-header"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 text-[#ff6b6b] w-full"
            >
              {/* Blinking Icon */}
              <AlertCircle className="min-w-[24px] min-h-[24px] animate-pulse" />
              
              <div className="flex items-center gap-1 overflow-hidden h-8 font-semibold tracking-wide text-sm md:text-base">
                {/* 3D Rolling Text (Sensor Name) */}
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeAlerts[currentIndex]}
                    initial={{ opacity: 0, y: 25, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -25, rotateX: 90 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d", transformOrigin: "center center" }}
                    className="font-bold whitespace-nowrap"
                  >
                    {activeAlerts[currentIndex]}
                  </motion.div>
                </AnimatePresence>
                
                {/* Static Alert Message */}
                <span className="whitespace-nowrap ml-1">
                  {getAlertMessage()}
                </span>
              </div>
            </motion.div>

          ) : (
            // NORMAL HEADER TITLE
            <motion.div
              key="normal-header"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <h1 className="text-lg md:text-[20px] tracking-wider font-semibold leading-tight text-white uppercase">
                {title}
              </h1>
              <p className={`text-xs md:text-sm mt-1 ${dateColor}`}>
                {getFormattedDate(currentDate, lang)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- SECTION: Controls (Language & Bell) --- */}
      <div className="flex items-center gap-4 md:gap-6 self-end sm:self-auto relative">
        
        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="bg-[#0B0F14]/50 border border-gray-500/25 text-white pl-2 pr-4 py-1.5 rounded-full flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
              <img
                src={lang === "en" ? "https://flagcdn.com/w40/us.png" : "https://flagcdn.com/w40/sa.png"}
                alt="Flag"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-semibold">{lang === "en" ? "Eng(US)" : "العربية"}</span>
            <ChevronDown size={14} className="md:w-4 md:h-4 text-gray-400" />
          </button>

          {isLangMenuOpen && (
            <div className="absolute top-full mt-2 w-full bg-[#0B0F14] border border-gray-500/25 rounded-xl overflow-hidden shadow-lg z-50">
              <button
                onClick={() => { setLang("en"); setIsLangMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 flex items-center gap-2"
              >
                English
              </button>
              <button
                onClick={() => { setLang("ar"); setIsLangMenuOpen(false); }}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10 flex items-center gap-2"
              >
                العربية
              </button>
            </div>
          )}
        </div>

        <div className={`relative cursor-pointer ${bellColor}`}>
          <Bell size={24} className="md:w-7 md:h-7" />
          {activeAlerts.length > 0 && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-[#9C0D0D] rounded-full border-2 border-[#04070C] animate-pulse" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;