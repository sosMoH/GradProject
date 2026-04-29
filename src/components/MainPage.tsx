import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

// Import Images
// I will keep generic placeholders for now.
import bgImage from "../assets/air-quality-monitors.png";
import deviceImage from "../assets/device.png";

const MainPage: React.FC = () => {
  return (
    // Responsive: Column on mobile, Row on desktop
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans text-white flex flex-col md:flex-row pb-[70px] md:pb-0">
      {/* Blurred Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 blur-[10px]"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Shared Sidebar Component - Set active to "home" */}
      <Sidebar activePage="home" />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col h-full overflow-y-auto md:overflow-hidden pb-[70px] md:pb-0">
        {/* Shared Header Component */}
        <Header
          title="AIR QUALITY MONITORING AND CONTROL"
          dateColor="text-white"
          bellColor="text-white"
        />

        {/* Hero Section */}
        {/* Removed pb-12 so it touches the bottom, and added mt-8 for mobile spacing */}
        <div className="flex-1 flex flex-col md:flex-row items-stretch justify-between px-6 md:px-12 mt-8 md:mt-0">
          {/* Typography (Order 1 on mobile) */}
          <div className="flex-1 order-1 md:order-2 flex flex-col justify-center max-w-[800px] z-10 md:pl-8 lg:pl-0">
            <h2 className="text-[32px] md:text-[48px] font-bold leading-tight md:leading-[60px] mb-4 md:mb-8">
              Cut costs and boost performance with reliable, real-time air
              quality data
            </h2>
            <p className="text-[20px] md:text-[32px] leading-snug md:leading-[40px] text-gray-200">
              Control your emissions and optimize the efficiency of your
              operations
            </p>
          </div>

          {/* Device Image (Order 2 on mobile) - Anchored to floor */}
          <div className="flex-1 order-2 md:order-1 flex justify-center items-end w-full mt-8 md:mt-0">
            <img
              src={deviceImage}
              alt="Air Quality Monitor Device"
              // items-end and object-bottom keep the leg at the bottom of the screen
              className="max-h-[45vh] md:max-h-[85vh] w-full object-contain object-bottom drop-shadow-2xl"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
