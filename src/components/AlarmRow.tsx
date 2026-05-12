import { motion } from "framer-motion";

const AlarmRow = ({ id, time, type, pm25, isSolved, image, onToggle }: any) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    // Dynamic Exit: If it's unsolved, swipe right (+50). If solved, swipe left (-50).
    exit={{ opacity: 0, x: isSolved ? -50 : 50, scale: 0.9 }}
    transition={{ duration: 0.2 }}
    className="flex items-center justify-between text-[16px] md:text-[18px] text-white/70 py-3 border-b border-gray-500/10 last:border-0"
  >
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
        onClick={() => onToggle(id)}
        className={`w-6 h-6 border ${isSolved ? "bg-[#3E9479] border-[#3E9479]" : "border-gray-500"} rounded-sm cursor-pointer transition-colors duration-200`}
      />
    </div>
  </motion.div>
);

export default AlarmRow;
