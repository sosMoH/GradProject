import { useState, useEffect } from "react";

export interface SensorData {
  aqi: number;
  pm25: number;
  co2: number;
  no2: number;
}

export const useSensorData = () => {
  // Initial starting values
  const [data, setData] = useState<SensorData>({
    aqi: 153,
    pm25: 143,
    co2: 1500,
    no2: 100,
  });

  useEffect(() => {
    // --- PRESENTATION DEMO MODE ---
    // This simulates live IoT data changing every 3 seconds so your gauges animate!
    const interval = setInterval(() => {
      setData((prev) => ({
        aqi: Math.max(0, prev.aqi + Math.floor(Math.random() * 11) - 5),      // Fluctuates +/- 5
        pm25: Math.max(0, prev.pm25 + Math.floor(Math.random() * 7) - 3),     // Fluctuates +/- 3
        co2: Math.max(400, prev.co2 + Math.floor(Math.random() * 41) - 20),   // Fluctuates +/- 20
        no2: Math.max(0, prev.no2 + Math.floor(Math.random() * 5) - 2),       // Fluctuates +/- 2
      }));
    }, 500);

    return () => clearInterval(interval);

    /* --- REAL API IMPLEMENTATION (For later) ---
    const fetchLatestData = async () => {
      const response = await fetch("https://YOUR_API_GATEWAY_URL/latest");
      const json = await response.json();
      setData(json); 
    };
    fetchLatestData();
    const realInterval = setInterval(fetchLatestData, 3000); 
    return () => clearInterval(realInterval);
    */
  }, []);

  return data;
};