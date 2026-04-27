import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./components/MainPage";
import OverviewPage from "./components/OverviewPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/overview" element={<OverviewPage />} />
        
        {/* Fallback route so the app doesn't break on missing pages */}
        <Route 
          path="*" 
          element={
            <div className="w-full h-screen bg-black text-white flex items-center justify-center text-2xl">
              Page Under Construction! (Click the browser back button)
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;