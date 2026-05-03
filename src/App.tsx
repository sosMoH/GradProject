import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import MainPage from "./pages/MainPage";
import OverviewPage from "./pages/OverviewPage";
import FaqsPage from "./pages/FaqsPage";

function App() {
  return (
    <Router>
      <Routes>
        
        {/* The Layout Route WRAPS the other pages */}
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/FAQs" element={<FaqsPage />} />
        </Route>

        {/* Fallback route outside the layout (optional, up to you) */}
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